import type { QuizQuestion } from '@/features/quiz/domain/quiz';

import questionFile from './de-bundesliga-top-scorers-level-1.json';

type ImportedQuestion = {
  id: string;
  question: string;
  playerHint: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  proofSeason: string;
  proofGoals: number;
  proofClub: string;
  sharedTitleInProofSeason: boolean;
  explanation: string;
};

const importedQuestions = questionFile.questions as ImportedQuestion[];

export const bundesligaTopScorersLevelOneQuestions: QuizQuestion[] = importedQuestions.map(
  (question) => ({
    id: question.id,
    gameType: 'career-path',
    difficulty: 'easy',
    prompt: question.question,
    clue: 'Bundesliga-Torschützenkönige seit 1963/64',
    options: question.options.map((option) => ({ id: option.id, label: option.text })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }),
);

export const bundesligaTopScorersLevelOneMeta = {
  title: questionFile.title,
  verifiedAsOf: questionFile.verifiedAsOf,
  seasonInProgress: questionFile.seasonInProgress,
  endSeasonInclusive: questionFile.scope.endSeasonInclusive,
  questionCount: questionFile.validation.questionCount,
  optionCount: questionFile.validation.optionCount,
  topScorerCount: questionFile.scope.knownUniqueTitleWinners,
} as const;
