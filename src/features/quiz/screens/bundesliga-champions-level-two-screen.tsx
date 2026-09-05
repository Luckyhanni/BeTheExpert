import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import {
  bundesligaChampionClubs,
  bundesligaChampionsLevelTwoMeta,
  findChampionByInput,
} from '@/features/quiz/data/bundesliga-champions-level-two';
import { colors, radii, spacing } from '@/theme/tokens';

type Feedback = { kind: 'success' | 'duplicate' | 'unknown'; message: string } | null;

export function BundesligaChampionsLevelTwoScreen() {
  const [input, setInput] = useState('');
  const [foundClubIds, setFoundClubIds] = useState<Set<string>>(() => new Set());
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showSolutions, setShowSolutions] = useState(false);

  const foundClubs = useMemo(
    () => bundesligaChampionClubs.filter((club) => foundClubIds.has(club.id)),
    [foundClubIds],
  );
  const missingClubs = useMemo(
    () => bundesligaChampionClubs.filter((club) => !foundClubIds.has(club.id)),
    [foundClubIds],
  );
  const progress = `${Math.round((foundClubIds.size / bundesligaChampionClubs.length) * 100)}%` as const;
  const isComplete = foundClubIds.size === bundesligaChampionClubs.length;

  function submitAnswer() {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const club = findChampionByInput(trimmedInput);

    if (!club) {
      setFeedback({ kind: 'unknown', message: 'Nicht erkannt – prüfe den vollständigen Vereinsnamen.' });
      return;
    }

    if (foundClubIds.has(club.id)) {
      setFeedback({ kind: 'duplicate', message: `${club.name} hast du bereits gefunden.` });
      setInput('');
      return;
    }

    setFoundClubIds((current) => new Set(current).add(club.id));
    setFeedback({ kind: 'success', message: `Richtig: ${club.name}` });
    setInput('');
  }

  function restart() {
    setInput('');
    setFoundClubIds(new Set());
    setFeedback(null);
    setShowSolutions(false);
  }

  if (isComplete) {
    return (
      <AppScreen>
        <View style={styles.completeHeader}>
          <Text style={styles.eyebrow}>LEVEL ABGESCHLOSSEN</Text>
          <Text style={styles.completeTitle}>Alle 30 Meister!</Text>
          <Text style={styles.completeIcon}>★</Text>
        </View>
        <Card style={styles.completeCard}>
          <Text style={styles.completeMessage}>
            Perfekt – du hast jeden deutschen Fußballmeister seit 1903 gefunden.
          </Text>
          <PrimaryButton label="Level wiederholen" onPress={restart} />
        </Card>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>BUNDESLIGA · MEISTER · LEVEL 2</Text>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{bundesligaChampionsLevelTwoMeta.title}</Text>
          <Text style={styles.counter}>{foundClubIds.size} / 30</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progress }]} />
        </View>
      </View>

      <Card>
        <Text style={styles.prompt}>{bundesligaChampionsLevelTwoMeta.question}</Text>
        <Text style={styles.hint}>{bundesligaChampionsLevelTwoMeta.playerHint}</Text>

        <TextInput
          accessibilityLabel="Vereinsname eingeben"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setInput}
          onSubmitEditing={submitAnswer}
          placeholder="Vereinsname eingeben"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          style={styles.input}
          value={input}
        />
        <PrimaryButton label="Antwort prüfen" onPress={submitAnswer} />

        {feedback ? (
          <View style={[styles.feedback, styles[`feedback_${feedback.kind}`]]}>
            <Text style={styles.feedbackText}>{feedback.message}</Text>
          </View>
        ) : null}
      </Card>

      {foundClubs.length ? (
        <View style={styles.foundSection}>
          <Text style={styles.sectionTitle}>Gefundene Meister</Text>
          <View style={styles.clubGrid}>
            {foundClubs.map((club) => (
              <View key={club.id} style={styles.clubChip}>
                <Text style={styles.clubCheck}>✓</Text>
                <View style={styles.clubChipCopy}>
                  <Text style={styles.clubName}>{club.name}</Text>
                  <Text style={styles.clubYear}>Erster Titel: {club.firstChampionshipYear}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => setShowSolutions((current) => !current)}
        style={styles.solutionButton}>
        <Text style={styles.solutionButtonText}>
          {showSolutions ? 'Lösungen verbergen' : 'Aufgeben und Lösungen anzeigen'}
        </Text>
      </Pressable>

      {showSolutions ? (
        <Card>
          <Text style={styles.sectionTitle}>Noch nicht gefunden</Text>
          <View style={styles.solutionList}>
            {missingClubs.map((club) => (
              <Text key={club.id} style={styles.solutionText}>
                {club.firstChampionshipYear} · {club.name}
              </Text>
            ))}
          </View>
        </Card>
      ) : null}

      <Text style={styles.sourceNote}>
        Stand: {bundesligaChampionsLevelTwoMeta.verifiedAsOf} · bis Saison {bundesligaChampionsLevelTwoMeta.lastCompletedSeason}
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, paddingTop: spacing.md },
  eyebrow: { color: colors.accent, fontSize: 13, fontWeight: '900', letterSpacing: 1.2 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.md },
  title: { flex: 1, color: colors.text, fontSize: 29, fontWeight: '900' },
  counter: { color: colors.text, fontSize: 19, fontWeight: '900' },
  progressTrack: { height: 10, borderRadius: radii.pill, backgroundColor: colors.surfaceElevated, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radii.pill, backgroundColor: colors.accent },
  prompt: { color: colors.text, fontSize: 23, fontWeight: '900', lineHeight: 30 },
  hint: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  input: {
    minHeight: 58,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  feedback: { padding: spacing.md, borderRadius: radii.sm, borderWidth: 1 },
  feedback_success: { borderColor: colors.success, backgroundColor: '#123525' },
  feedback_duplicate: { borderColor: colors.warning, backgroundColor: '#332A12' },
  feedback_unknown: { borderColor: colors.danger, backgroundColor: '#3A1B1B' },
  feedbackText: { color: colors.text, fontSize: 15, fontWeight: '800' },
  foundSection: { gap: spacing.md },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  clubGrid: { gap: spacing.sm },
  clubChip: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  clubCheck: { color: colors.success, fontSize: 22, fontWeight: '900' },
  clubChipCopy: { flex: 1, gap: 2 },
  clubName: { color: colors.text, fontSize: 16, fontWeight: '800' },
  clubYear: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  solutionButton: { alignSelf: 'center', padding: spacing.md },
  solutionButtonText: { color: colors.textMuted, fontSize: 15, fontWeight: '800', textAlign: 'center' },
  solutionList: { gap: spacing.sm },
  solutionText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  sourceNote: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  completeHeader: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xl },
  completeTitle: { color: colors.text, fontSize: 34, fontWeight: '900', textAlign: 'center' },
  completeIcon: { color: colors.accent, fontSize: 72 },
  completeCard: { marginTop: spacing.md },
  completeMessage: { color: colors.text, fontSize: 18, lineHeight: 26, textAlign: 'center' },
});
