import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { emitKeypressEvents } from 'node:readline';

export const PROJECT_REF = 'gjclmjxfsflnpruvqlob';
const endpoint = `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`;
const body = '<h2>Dein Be-the-Expert-Anmeldecode</h2>\n<p>Gib diesen Code in der App ein:</p>\n<p><strong>{{ .Token }}</strong></p>\n<p>Falls du keinen Code angefordert hast, ignoriere diese E-Mail.</p>';
export const EMAIL_CONFIG = Object.freeze({
  mailer_subjects_confirmation: 'Dein Be-the-Expert-Anmeldecode',
  mailer_subjects_magic_link: 'Dein Be-the-Expert-Anmeldecode',
  mailer_templates_confirmation_content: body,
  mailer_templates_magic_link_content: body,
  mailer_otp_length: 6,
});

export function describeConfig(config) {
  // Never print raw server config: it can contain SMTP passwords and hook secrets.
  return {
    'Eigener SMTP-Versand konfiguriert': Boolean(config.smtp_host),
    'Send-Email-Hook aktiv': config.hook_send_email_enabled === true,
    'Registrierungsvorlage entspricht Code-Vorlage': config.mailer_templates_confirmation_content?.trim() === body,
    'Loginvorlage entspricht Code-Vorlage': config.mailer_templates_magic_link_content?.trim() === body,
    'Betreff Registrierung korrekt': config.mailer_subjects_confirmation === EMAIL_CONFIG.mailer_subjects_confirmation,
    'Betreff Login korrekt': config.mailer_subjects_magic_link === EMAIL_CONFIG.mailer_subjects_magic_link,
    'Code hat sechs Stellen': config.mailer_otp_length === 6,
  };
}

export async function repairEmailConfig(token, { apply = false, fetcher = fetch, report = () => {} } = {}) {
  async function request(method, payload) {
    const response = await fetcher(endpoint, {
      method, redirect: 'error', signal: AbortSignal.timeout(20000),
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
    if (!response.ok) throw new Error(`Supabase Management API: HTTP ${response.status}. Bei 401/403 bitte Access Token und Projektzugriff pruefen.`);
    return response.json();
  }
  const current = await request('GET');
  report(describeConfig(current));
  if (!apply) return { applied: false };
  if (current.hook_send_email_enabled) throw new Error('Ein Send-Email-Hook uebernimmt den Versand. Keine Aenderung vorgenommen; der Hook muss zuerst untersucht werden.');
  if (!current.smtp_host) throw new Error('Eigener SMTP-Versand ist nicht konfiguriert. Keine Aenderung vorgenommen.');
  await request('PATCH', EMAIL_CONFIG);
  const saved = await request('GET');
  report(describeConfig(saved));
  if (!Object.entries(EMAIL_CONFIG).every(([key, value]) => saved[key] === value)) {
    throw new Error('Die Speicherung konnte nicht vollstaendig bestaetigt werden. Keine Erfolgsmeldung; bitte die obigen Pruefergebnisse weitergeben.');
  }
  if (saved.hook_send_email_enabled) throw new Error('Vorlagen gespeichert, aber ein Send-Email-Hook ist inzwischen aktiv. Versand noch nicht bestaetigt.');
  return { applied: true };
}

function readHiddenToken() {
  if (!process.stdin.isTTY) throw new Error('Bitte im sichtbaren Terminal starten.');
  process.stdout.write('Supabase Personal Access Token einfuegen (Eingabe bleibt unsichtbar), dann Enter: ');
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolveToken, reject) => {
    let value = '';
    const finish = () => { process.stdin.off('keypress', onKey); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n'); };
    function onKey(text, key = {}) {
      if (key.ctrl && key.name === 'c') { finish(); reject(new Error('Abgebrochen.')); }
      else if (key.name === 'return' || key.name === 'enter') { finish(); resolveToken(value.trim()); }
      else if (key.name === 'backspace') value = value.slice(0, -1);
      else if (!key.ctrl && !key.meta && text) value += text.replace(/[\x00-\x1f\x7f]/g, '');
    }
    process.stdin.on('keypress', onKey);
  });
}

async function main() {
  const envText = await readFile(new URL('../.env', import.meta.url), 'utf8');
  const configuredUrl = envText.replace(/^\uFEFF/, '').split(/\r?\n/).find((line) => line.startsWith('EXPO_PUBLIC_SUPABASE_URL='))?.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
  if (configuredUrl !== `https://${PROJECT_REF}.supabase.co`) throw new Error('Projektadresse stimmt nicht mit BeTheExpert ueberein. Abbruch.');
  const apply = process.argv.includes('--apply');
  console.log(`BeTheExpert: ${PROJECT_REF}\n${apply ? 'Setzt Registrierung und Login auf Code-Mails (6 Stellen) und liest die Einstellungen danach zur Kontrolle erneut.' : 'Liest nur die gespeicherten E-Mail-Einstellungen.'}`);
  console.log('Token unter https://supabase.com/dashboard/account/tokens erstellen. Nicht in den Chat oder in .env kopieren.\nDer Token wird nur im Arbeitsspeicher verwendet und nur an api.supabase.com gesendet.');
  const token = await readHiddenToken();
  if (!token.startsWith('sbp_')) throw new Error('Benoetigt wird ein Personal Access Token (sbp_), kein Publishable- oder Service-Role-Key.');
  const result = await repairEmailConfig(token, { apply, report: (settings) => {
    for (const [name, value] of Object.entries(settings)) console.log(`${name}: ${value ? 'JA' : 'NEIN'}`);
  } });
  console.log(result.applied ? 'ERFOLG: Beide Code-Vorlagen und die Code-Laenge wurden gespeichert und verifiziert. In der App einen NEUEN Code anfordern. E-Mail-Zustellung selbst ist noch zu pruefen.' : 'Pruefung abgeschlossen.');
  console.log('Den temporaeren Access Token kannst du jetzt im Supabase-Dashboard widerrufen.');
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === pathToFileURL(fileURLToPath(import.meta.url)).href) {
  main().catch((error) => {
    // Network errors can contain request metadata. Print only our own controlled messages.
    console.error(error?.message?.startsWith('Supabase Management API:') || /^(Ein Send-|Eigener SMTP|Die Speicherung|Vorlagen gespeichert|Projektadresse|Benoetigt|Bitte im|Abgebrochen)/.test(error?.message ?? '') ? error.message : 'Pruefung fehlgeschlagen. Internetverbindung und lokale .env-Datei pruefen.');
    process.exitCode = 1;
  });
}
