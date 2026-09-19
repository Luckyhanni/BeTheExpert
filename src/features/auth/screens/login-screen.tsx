import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { AppScreen } from '@/components/ui/app-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import { getSupabaseClient } from '@/lib/supabase';
import { colors, spacing } from '@/theme/tokens';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const locked = useRef(false);
  const lastSent = useRef(0);
  async function perform(verify: boolean) {
    if (locked.current) return;
    const address = (sentTo || email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) { setMessage('Bitte gib eine gültige E-Mail-Adresse ein.'); return; }
    if (verify && !/^\d{6,10}$/.test(code.trim())) { setMessage('Bitte gib den Zahlencode aus deiner E-Mail ein.'); return; }
    if (!verify && Date.now() - lastSent.current < 60000) { setMessage('Bitte warte eine Minute, bevor du einen neuen Code anforderst.'); return; }
    const client = getSupabaseClient();
    if (!client) return;
    locked.current = true; setBusy(true); setMessage('');
    try {
      const { error } = verify
        ? await client.auth.verifyOtp({ email: address, token: code.trim(), type: 'email' })
        : await client.auth.signInWithOtp({ email: address, options: { shouldCreateUser: true } });
      if (error) {
        setMessage(error.status === 429 ? 'Zu viele Versuche. Bitte warte kurz und versuche es später erneut.' : verify ? 'Der Code ist ungültig oder abgelaufen. Prüfe ihn oder fordere einen neuen an.' : 'Der Code konnte nicht gesendet werden. Bitte versuche es später erneut.');
      } else if (!verify) { lastSent.current = Date.now(); setSentTo(address); setCode(''); setMessage('Code gesendet. Schau auch im Spam-Ordner nach.'); }
    } catch { setMessage('Keine Verbindung. Bitte prüfe dein Internet und versuche es erneut.'); }
    finally { locked.current = false; setBusy(false); }
  }
  return <AppScreen>
    <Text style={styles.brand}>BE THE EXPERT</Text>
    <Text style={styles.title}>{sentTo ? 'Dein Anmeldecode' : 'Deine eigene Karriere'}</Text>
    <Text style={styles.copy}>{sentTo ? `Gib den Code ein, den wir an ${sentTo} geschickt haben.` : 'Melde dich mit deiner E-Mail an. Dein Fortschritt bleibt in deinem Konto – auch auf einem anderen Gerät. Beim ersten Login wird dein Konto erstellt.'}</Text>
    {sentTo ? <TextInput accessibilityLabel="Anmeldecode" style={styles.input} value={code} onChangeText={setCode} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" maxLength={10} editable={!busy} onSubmitEditing={() => void perform(true)} />
      : <TextInput accessibilityLabel="E-Mail-Adresse" placeholder="E-Mail-Adresse" placeholderTextColor={colors.textMuted} style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" editable={!busy} onSubmitEditing={() => void perform(false)} />}
    <PrimaryButton disabled={busy} label={busy ? 'Bitte warten …' : sentTo ? 'Anmelden' : 'Code per E-Mail erhalten'} onPress={() => void perform(!!sentTo)} />
    {sentTo ? <><Pressable accessibilityRole="button" disabled={busy} onPress={() => void perform(false)}><Text style={styles.link}>Neuen Code senden</Text></Pressable><Pressable accessibilityRole="button" disabled={busy} onPress={() => { setSentTo(''); setCode(''); setMessage(''); }}><Text style={styles.link}>Andere E-Mail verwenden</Text></Pressable></> : null}
    {message ? <Text accessibilityLiveRegion="polite" style={styles.copy}>{message}</Text> : null}
  </AppScreen>;
}
const styles = StyleSheet.create({
  brand: { color: colors.accent, fontWeight: '900', marginTop: spacing.xl },
  title: { color: colors.text, fontSize: 30, fontWeight: '900' },
  copy: { color: colors.textMuted, fontSize: 16, lineHeight: 24 },
  input: { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 18 },
  link: { color: colors.accent, paddingVertical: 12, fontSize: 16 },
});
