import type { QuizQuestion } from '@/features/quiz/domain/quiz';

import questionFile from './de-bundesliga-champions-level-1.json';

type ImportedQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
};

const importedQuestions = questionFile.questions as ImportedQuestion[];

export const bundesligaChampionsLevelOneQuestions: QuizQuestion[] = importedQuestions.map(
  (question) => ({
    id: question.id,
    gameType: 'career-path',
    difficulty: 'easy',
    prompt: question.question,
    clue: 'Deutsche Fußballmeister seit 1903',
    options: question.options.map((option) => ({ id: option.id, label: option.text })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }),
);

export const bundesligaChampionsLevelOneMeta = {
  title: 'Meister · Level 1',
  scope: questionFile.scope.included,
  verifiedAsOf: questionFile.verifiedAsOf,
  questionCount: questionFile.integrity.questionCount,
} as const;
