import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { mockCareerQuestion } from '@/features/quiz/data/mock-questions';
import { isCorrectAnswer } from '@/features/quiz/domain/quiz';
import { BundesligaChampionsLevelOneScreen } from '@/features/quiz/screens/bundesliga-champions-level-one-screen';
import { colors, radii, spacing } from '@/theme/tokens';

export function PlayScreen() {
  const params = useLocalSearchParams<{
    leagueId?: string;
    categoryId?: string;
    level?: string;
  }>();

  if (
    params.leagueId === 'de-1' &&
    params.categoryId === 'champions' &&
    params.level === '1'
  ) {
    return <BundesligaChampionsLevelOneScreen />;
  }

  return <MockPlayScreen />;
}

function MockPlayScreen() {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const hasAnswered = selectedOptionId !== null;
  const isCorrect = hasAnswered && isCorrectAnswer(mockCareerQuestion, selectedOptionId);

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>KARRIEREPFAD · NORMAL</Text>
        <Text style={styles.title}>Redaktionsauftrag</Text>
        <Text style={styles.subtitle}>Frage 1 von 5</Text>
      </View>

      <Card>
        <Text style={styles.prompt}>{mockCareerQuestion.prompt}</Text>
        <View style={styles.clueBox}>
          <Text style={styles.clue}>{mockCareerQuestion.clue}</Text>
        </View>

        <View style={styles.options}>
          {mockCareerQuestion.options.map((option, index) => {
            const selected = selectedOptionId === option.id;
            const correct = hasAnswered && option.id === mockCareerQuestion.correctOptionId;
            const wrong = hasAnswered && selected && !correct;

            return (
              <Pressable
                accessibilityRole="button"
                disabled={hasAnswered}
                key={option.id}
                onPress={() => setSelectedOptionId(option.id)}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                  selected && styles.optionSelected,
                  correct && styles.optionCorrect,
                  wrong && styles.optionWrong,
                ]}>
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                <Text style={styles.optionText}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {hasAnswered && (
        <Card style={isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}>
          <Text style={styles.feedbackTitle}>{isCorrect ? 'Stark recherchiert!' : 'Fast – gute Spur.'}</Text>
          <Text style={styles.feedbackText}>{mockCareerQuestion.explanation}</Text>
          <PrimaryButton label="Noch einmal spielen" onPress={() => setSelectedOptionId(null)} />
        </Card>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, paddingTop: spacing.md },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 29, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: 14 },
  prompt: { color: colors.text, fontSize: 22, fontWeight: '800', lineHeight: 29 },
  clueBox: { backgroundColor: colors.background, borderRadius: radii.sm, padding: spacing.md },
  clue: { color: colors.accent, fontSize: 16, fontWeight: '800', lineHeight: 25, textAlign: 'center' },
  options: { gap: spacing.sm },
  option: { flexDirection: 'row', alignItems: 'center', minHeight: 54, gap: spacing.md, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  optionPressed: { backgroundColor: colors.surfaceElevated },
  optionSelected: { borderColor: colors.accent },
  optionCorrect: { borderColor: colors.success, backgroundColor: '#123525' },
  optionWrong: { borderColor: colors.danger, backgroundColor: '#3A1B1B' },
  optionLetter: { color: colors.accent, fontSize: 14, fontWeight: '900' },
  optionText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  feedbackCorrect: { borderColor: colors.success },
  feedbackWrong: { borderColor: colors.warning },
  feedbackTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  feedbackText: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
});
