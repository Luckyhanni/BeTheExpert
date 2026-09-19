import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { saveCareerResult } from '@/features/career/data/career-progress';
import { createCareerSession, matchAnswer, passedCareerLevel, scoreRound, type CareerPack } from '@/features/quiz/domain/career';
import { colors, radii, spacing } from '@/theme/tokens';
import { CAREER_PLAYTEST_UNLOCK_ALL } from '@/features/career/data/career-settings';
import { useAuth } from '@/features/auth/auth-provider';

export function CareerLevelScreen({ pack }: { pack: CareerPack }) {
  const { session } = useAuth();
  const router = useRouter();
  const [rounds, setRounds] = useState(() => createCareerSession(pack));
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [seconds, setSeconds] = useState(pack.timeLimitSeconds ?? 0);
  const [scores, setScores] = useState<number[]>([]);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [showSources, setShowSources] = useState(false);
  const deadline = useRef(0);
  const closed = useRef(false);
  const submittedRef = useRef<string[]>([]);
  const round = rounds[index];

  const closeRound = useCallback((ids: string[] = submittedRef.current) => {
    if (closed.current) return;
    closed.current = true;
    setScores((current) => [...current, scoreRound(round, ids)]);
    setRevealed(true);
  }, [round]);

  useEffect(() => {
    if (!started || revealed || finished || !pack.timeLimitSeconds) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) closeRound();
    };
    const interval = setInterval(tick, 100);
    const subscription = AppState.addEventListener('change', tick);
    tick();
    return () => { clearInterval(interval); subscription.remove(); };
  }, [started, revealed, finished, pack.timeLimitSeconds, closeRound]);

  function begin() {
    deadline.current = Date.now() + (pack.timeLimitSeconds ?? 0) * 1000;
    setStarted(true);
  }
  function setAnswers(ids: string[]) { submittedRef.current = ids; setSubmitted(ids); }
  function canAnswer(now: number) {
    if (closed.current || !started) return false;
    if (pack.timeLimitSeconds && now >= deadline.current) { closeRound(); return false; }
    return true;
  }
  function submitText(now: number) {
    if (!canAnswer(now) || !input.trim()) return;
    const answer = matchAnswer(input, round.answers);
    if (!answer) {
      setMessage('Nicht erkannt. Prüfe den vollständigen Namen.');
      if (round.mode === 'text') closeRound([]);
      return;
    }
    if (submittedRef.current.includes(answer.id)) { setMessage('Bereits genannt – zählt nur einmal.'); setInput(''); return; }
    const ids = [...submittedRef.current, answer.id];
    setAnswers(ids); setInput(''); setMessage(`Richtig: ${answer.label}`);
    if (ids.length === round.answers.length) closeRound(ids);
  }
  function select(id: string, now: number) {
    if (!canAnswer(now)) return;
    if (round.mode === 'choice') { setAnswers([id]); closeRound([id]); return; }
    const ids = submittedRef.current.includes(id) ? submittedRef.current.filter((a) => a !== id) : [...submittedRef.current, id];
    setAnswers(ids);
  }
  async function persistResult() {
    setSaveState('saving');
    try {
      const score = scores.reduce((a, b) => a + b, 0);
      await saveCareerResult(pack.id, score / rounds.length * 100, passedCareerLevel(score, rounds.length), session?.user.id);
      setSaveState('saved');
    } catch { setSaveState('failed'); }
  }
  function next() {
    if (index === rounds.length - 1) { setFinished(true); void persistResult(); return; }
    setIndex(index + 1); setAnswers([]); setInput(''); setMessage(''); setRevealed(false); setShowSources(false);
    closed.current = false;
    // Every sprint starts explicitly, so reading feedback never consumes the next clock.
    setStarted(pack.timeLimitSeconds === null); setSeconds(pack.timeLimitSeconds ?? 0);
  }
  function restart() {
    setRounds(createCareerSession(pack)); setIndex(0); setScores([]); setAnswers([]); setInput('');
    setMessage(''); setRevealed(false); setFinished(false); setStarted(false); setSaveState('idle');
    setShowSources(false); closed.current = false; setSeconds(pack.timeLimitSeconds ?? 0);
  }

  if (finished) {
    const score = scores.reduce((a, b) => a + b, 0);
    const passed = passedCareerLevel(score, rounds.length);
    return <AppScreen><Text style={styles.eyebrow}>{passed ? 'LEVEL BESTANDEN' : 'WEITER TRAINIEREN'}</Text>
      <Text style={styles.title}>{Math.round(score / rounds.length * 100)} % richtig</Text>
      <Card><Text style={styles.body}>{CAREER_PLAYTEST_UNLOCK_ALL ? `${passed ? 'Geschafft! Level bestanden.' : 'Ab 80 % gilt das Level als bestanden.'} Im Testmodus bleiben alle vorhandenen Level frei spielbar.` : passed ? pack.level === 4 ? 'Geschafft! Du hast auch die höchste Stufe dieses Bereichs bestanden.' : 'Geschafft! Dein nächstes Level ist freigeschaltet.' : 'Ab 80 % gilt das Level als bestanden.'}</Text>
        <Text style={styles.muted}>{saveState === 'saved' ? 'Fortschritt gespeichert.' : saveState === 'failed' ? 'Speichern fehlgeschlagen. Bitte erneut versuchen.' : 'Fortschritt wird gespeichert …'}</Text>
        {saveState === 'failed' && <PrimaryButton label="Speichern erneut versuchen" onPress={() => void persistResult()} />}
        <PrimaryButton label="Neue Runde" onPress={restart} />
        <PrimaryButton label="Zur Karriere" onPress={() => router.replace('/career')} />
      </Card></AppScreen>;
  }

  return <AppScreen>
    <Text style={styles.eyebrow}>{pack.leagueId === 'de-1' ? 'BUNDESLIGA' : '2. BUNDESLIGA'} · LEVEL {pack.level}</Text>
    <Text style={styles.title}>{pack.title}</Text>
    <Text style={styles.muted}>Aufgabe {index + 1} / {rounds.length} · {pack.rounds.length} Aufgaben im Pool</Text>
    {!started ? <Card>
      <Text style={styles.body}>{pack.scope}</Text>
      <Text style={styles.muted}>{pack.timeLimitSeconds ? 'Nach dem Start hast du zehn Sekunden. Die Zeit läuft auch beim Wechsel in andere Apps weiter.' : round.mode === 'choice' ? 'Ohne Zeitlimit. Wähle genau eine der vier Antworten.' : round.mode === 'order' ? 'Ohne Zeitlimit. Tippe die Vereine in der gefragten Reihenfolge an.' : 'Ohne Zeitlimit. Namen einzeln eingeben; Umlaute und hinterlegte Kurzformen werden erkannt.'}</Text>
      <Text style={styles.muted}>Listen zählen anteilig nach gefundenen Lösungen; Sortieraufgaben zählen nur vollständig richtig. Bestehen ab 80 %.</Text>
      <PrimaryButton label={pack.timeLimitSeconds ? 'Sprint starten · 10 Sekunden' : 'Aufgabe starten'} onPress={begin} />
    </Card> : <>
      {pack.timeLimitSeconds !== null && <Text accessibilityLiveRegion="polite" style={styles.timer}>{seconds} Sekunden</Text>}
      <Card>
        <Text style={styles.question}>{round.prompt}</Text>
        <Text style={styles.muted}>{round.hint}</Text>
        {(round.mode === 'choice' || round.mode === 'order') && <View style={styles.stack}>
          {round.mode === 'order' && <Text style={styles.muted}>In der gewünschten Reihenfolge antippen. Erneutes Tippen entfernt den Verein.</Text>}
          {round.options.map((option) => <Pressable key={option.id} accessibilityRole="button" disabled={revealed}
            onPress={() => select(option.id, Date.now())} style={[styles.option, submitted.includes(option.id) && styles.selected]}>
            <Text style={styles.body}>{round.mode === 'order' && submitted.includes(option.id) ? `${submitted.indexOf(option.id) + 1}. ` : ''}{option.label}</Text>
          </Pressable>)}
          {round.mode === 'order' && !revealed && <PrimaryButton label="Reihenfolge prüfen" onPress={() => { if (canAnswer(Date.now())) closeRound(); }} />}
        </View>}
        {(round.mode === 'text' || round.mode === 'set') && !revealed && <>
          <TextInput accessibilityLabel="Antwort eingeben" style={styles.input} value={input} onChangeText={setInput}
            placeholder="Name eingeben" placeholderTextColor={colors.textMuted} autoCorrect={false} autoCapitalize="words"
            onSubmitEditing={() => submitText(Date.now())} returnKeyType="done" />
          <PrimaryButton label="Antwort prüfen" onPress={() => submitText(Date.now())} />
        </>}
        {round.mode === 'set' && <Text style={styles.eyebrow}>{submitted.length} / {round.answers.length} gefunden</Text>}
        {message !== '' && <Text accessibilityLiveRegion="polite" style={styles.body}>{message}</Text>}
        {round.mode === 'set' && submitted.map((id) => <Text style={styles.muted} key={id}>✓ {round.answers.find((a) => a.id === id)?.label}</Text>)}
        {!revealed && round.mode !== 'choice' && <Pressable accessibilityRole="button" onPress={() => closeRound()} style={styles.option}>
          <Text style={styles.muted}>Runde beenden und Lösungen anzeigen</Text>
        </Pressable>}
      </Card>
      {revealed && <Card>
        <Text style={styles.question}>{Math.round((scores[index] ?? 0) * 100)} % richtig</Text>
        <Text style={styles.body}>{round.explanation}</Text>
        <Pressable accessibilityRole="button" onPress={() => setShowSources(!showSources)}><Text style={styles.link}>Belege {showSources ? 'verbergen' : 'anzeigen'}</Text></Pressable>
        {showSources && round.sources.map((source, i) => <Pressable key={source} accessibilityRole="link" onPress={() => { void Linking.openURL(source).catch(() => setMessage('Quelle konnte nicht geöffnet werden.')); }}>
          <Text style={styles.link}>Quelle {i + 1} · {new URL(source).hostname}</Text>
        </Pressable>)}
        <PrimaryButton label={index === rounds.length - 1 ? 'Ergebnis anzeigen' : 'Nächste Aufgabe'} onPress={next} />
      </Card>}
    </>}
    <Text style={styles.muted}>Quellenabruf: {pack.verifiedAsOf} · Für die Wertung gilt der Datenstand in der Aufgabe.</Text>
  </AppScreen>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900' },
  question: { color: colors.text, fontSize: 22, fontWeight: '800', lineHeight: 29 },
  body: { color: colors.text, fontSize: 17, lineHeight: 25 },
  muted: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
  timer: { color: colors.accent, fontSize: 26, fontWeight: '900' },
  stack: { gap: spacing.sm },
  option: { borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border, padding: spacing.md, minHeight: 48 },
  selected: { borderColor: colors.accent, backgroundColor: colors.surfaceElevated },
  input: { color: colors.text, minHeight: 56, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, fontSize: 17 },
  link: { color: colors.accent, fontSize: 14, paddingVertical: spacing.sm },
});
