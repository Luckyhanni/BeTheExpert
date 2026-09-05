import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { isCorrectAnswer, type QuizQuestion } from '@/features/quiz/domain/quiz';
import { colors, radii, spacing } from '@/theme/tokens';

type MultipleChoiceLevelScreenProps = {
  questions: QuizQuestion[];
  eyebrow: string;
  title: string;
  sourceNote: string;
  successMessage: string;
  retryMessage: string;
};

export function MultipleChoiceLevelScreen({
  questions,
  eyebrow,
  title,
  sourceNote,
  successMessage,
  retryMessage,
}: MultipleChoiceLevelScreenProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[questionIndex];
  const hasAnswered = selectedOptionId !== null;
  const answeredCorrectly = hasAnswered && isCorrectAnswer(question, selectedOptionId);
  const progress = `${Math.round(((questionIndex + 1) / questions.length) * 100)}%` as const;

  function answer(optionId: string) {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
    if (isCorrectAnswer(question, optionId)) setCorrectAnswers((current) => current + 1);
  }

  function continueQuiz() {
    if (questionIndex === questions.length - 1) {
      setIsComplete(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedOptionId(null);
  }

  function restart() {
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setCorrectAnswers(0);
    setIsComplete(false);
  }

  if (isComplete) {
    const percent = Math.round((correctAnswers / questions.length) * 100);

    return (
      <AppScreen>
        <View style={styles.resultHeader}>
          <Text style={styles.eyebrow}>LEVEL ABGESCHLOSSEN</Text>
          <Text style={styles.resultTitle}>{correctAnswers} / {questions.length} richtig</Text>
          <Text style={styles.resultPercent}>{percent} %</Text>
        </View>
        <Card style={styles.resultCard}>
          <Text style={styles.resultMessage}>{percent >= 80 ? successMessage : retryMessage}</Text>
          <PrimaryButton label="Level wiederholen" onPress={restart} />
        </Card>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.counter}>{questionIndex + 1} / {questions.length}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progress }]} />
        </View>
      </View>

      <Card>
        <Text style={styles.scopeLabel}>{question.clue}</Text>
        <Text style={styles.prompt}>{question.prompt}</Text>

        <View style={styles.options}>
          {question.options.map((option, index) => {
            const selected = selectedOptionId === option.id;
            const correct = hasAnswered && option.id === question.correctOptionId;
            const wrong = hasAnswered && selected && !correct;

            return (
              <Pressable
                accessibilityRole="button"
                disabled={hasAnswered}
                key={option.id}
                onPress={() => answer(option.id)}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                  correct && styles.optionCorrect,
                  wrong && styles.optionWrong,
                ]}>
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                <Text style={styles.optionText}>{option.label}</Text>
                {correct ? <Text style={styles.answerMark}>✓</Text> : null}
                {wrong ? <Text style={styles.wrongMark}>×</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {hasAnswered ? (
        <Card style={answeredCorrectly ? styles.feedbackCorrect : styles.feedbackWrong}>
          <Text style={styles.feedbackTitle}>
            {answeredCorrectly ? 'Richtig!' : 'Leider falsch.'}
          </Text>
          <Text style={styles.feedbackText}>{question.explanation}</Text>
          <PrimaryButton
            label={questionIndex === questions.length - 1 ? 'Ergebnis anzeigen' : 'Nächste Frage  →'}
            onPress={continueQuiz}
          />
        </Card>
      ) : null}

      <Text style={styles.sourceNote}>{sourceNote}</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, paddingTop: spacing.md },
  eyebrow: { color: colors.accent, fontSize: 13, fontWeight: '900', letterSpacing: 1.2 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.md },
  title: { flex: 1, color: colors.text, fontSize: 29, fontWeight: '900' },
  counter: { color: colors.textMuted, fontSize: 16, fontWeight: '800' },
  progressTrack: { height: 9, borderRadius: radii.pill, backgroundColor: colors.surfaceElevated, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radii.pill, backgroundColor: colors.accent },
  scopeLabel: { color: colors.accent, fontSize: 14, fontWeight: '800' },
  prompt: { color: colors.text, fontSize: 25, fontWeight: '900', lineHeight: 32 },
  options: { gap: spacing.sm },
  option: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  optionPressed: { backgroundColor: colors.surfaceElevated },
  optionCorrect: { borderColor: colors.success, backgroundColor: '#123525' },
  optionWrong: { borderColor: colors.danger, backgroundColor: '#3A1B1B' },
  optionLetter: { width: 22, color: colors.accent, fontSize: 16, fontWeight: '900' },
  optionText: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '700' },
  answerMark: { color: colors.success, fontSize: 24, fontWeight: '900' },
  wrongMark: { color: colors.danger, fontSize: 27, fontWeight: '900' },
  feedbackCorrect: { borderColor: colors.success },
  feedbackWrong: { borderColor: colors.warning },
  feedbackTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  feedbackText: { color: colors.textMuted, fontSize: 16, lineHeight: 23 },
  sourceNote: { color: colors.textMuted, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  resultHeader: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xl },
  resultTitle: { color: colors.text, fontSize: 34, fontWeight: '900', textAlign: 'center' },
  resultPercent: { color: colors.accent, fontSize: 48, fontWeight: '900' },
  resultCard: { marginTop: spacing.md },
  resultMessage: { color: colors.text, fontSize: 18, lineHeight: 26, textAlign: 'center' },
});
