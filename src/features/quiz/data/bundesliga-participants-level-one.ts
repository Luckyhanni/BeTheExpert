import type { QuizQuestion } from '@/features/quiz/domain/quiz';

import questionFile from './de-bundesliga-participants-level-1.json';

type ImportedQuestion = {
  id: string;
  question: string;
  playerHint: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  firstBundesligaSeason: string;
  explanation: string;
};

const importedQuestions = questionFile.questions as ImportedQuestion[];

export const bundesligaParticipantsLevelOneQuestions: QuizQuestion[] = importedQuestions.map(
  (question) => ({
    id: question.id,
    gameType: 'career-path',
    difficulty: 'easy',
    prompt: question.question,
    clue: 'Männer-Bundesliga seit 1963',
    options: question.options.map((option) => ({ id: option.id, label: option.text })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }),
);

export const bundesligaParticipantsLevelOneMeta = {
  title: questionFile.title,
  verifiedAsOf: questionFile.verifiedAsOf,
  seasonInProgress: questionFile.seasonInProgress,
  questionCount: questionFile.validation.questionCount,
  participantCount: questionFile.scope.participantCountAtCutoff,
} as const;
