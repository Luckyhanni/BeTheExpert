import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { AppScreen } from '@/components/ui/app-screen';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAuth } from '@/features/auth/auth-provider';
import { useAccountSummary } from '@/features/auth/use-account-summary';
import { saveDisplayName } from '@/features/auth/data/account';
import { getSupabaseClient } from '@/lib/supabase';
import { colors } from '@/theme/tokens';

export function ProfileScreen() {
  const { session } = useAuth();
  const summary = useAccountSummary();
  const [name, setName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function save() {
    if (busy) return;
    setBusy(true); setMessage('');
    try { await saveDisplayName(name ?? summary.name, session?.user.id); setMessage('Dein Name ist gespeichert.'); }
    catch { setMessage('Name konnte nicht gespeichert werden. Verwende 2 bis 32 Zeichen und prüfe deine Verbindung.'); }
    finally { setBusy(false); }
  }
  async function logout() {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      const result = await getSupabaseClient()?.auth.signOut({ scope: 'local' });
      if (result?.error) throw result.error;
    } catch { setMessage('Abmelden fehlgeschlagen. Bitte versuche es erneut.'); }
    finally { setBusy(false); }
  }
  return <AppScreen>
    <Text style={styles.title}>Dein Profil</Text>
    <Card><Text style={styles.heading}>{session ? session.user.email : 'Lokales Profil'}</Text>
      <Text style={styles.copy}>{session ? 'Dein Fortschritt und deine Ligaauswahl werden in deinem Konto gespeichert. Zum Laden und Speichern brauchst du Internet.' : 'Deine Daten liegen nur auf diesem Gerät. Der Konto-Login ist noch nicht eingerichtet.'}</Text>
    </Card>
    <Card><Text style={styles.heading}>{summary.loading ? 'Fortschritt wird geladen …' : summary.error ? 'Fortschritt konnte nicht geladen werden.' : `${summary.passed} Karriere-Level bestanden`}</Text></Card>
    {session ? <Card><Text style={styles.heading}>Spielername</Text>
      <TextInput accessibilityLabel="Spielername" style={styles.input} value={name ?? summary.name} onChangeText={setName} maxLength={32} editable={!busy} autoCorrect={false} />
      <PrimaryButton disabled={busy || summary.loading || summary.error} label={busy ? 'Bitte warten …' : 'Namen speichern'} onPress={() => void save()} />
    </Card> : null}
    {message ? <Text accessibilityLiveRegion="polite" style={styles.copy}>{message}</Text> : null}
    {session ? <PrimaryButton disabled={busy} label="Auf diesem Gerät abmelden" onPress={() => void logout()} /> : null}
  </AppScreen>;
}
const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 30, fontWeight: '900' },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700' },
  copy: { color: colors.textMuted, fontSize: 15, lineHeight: 23 },
  input: { color: colors.text, borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 18 },
});
