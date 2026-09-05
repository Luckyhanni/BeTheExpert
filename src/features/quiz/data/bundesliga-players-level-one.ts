import type { QuizQuestion } from '@/features/quiz/domain/quiz';

import questionFile from './de-bundesliga-players-level-1.json';

type ImportedQuestion = {
  id: string;
  question: string;
  targetClubId: string;
  targetClub: string;
  playerHint: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  proofSeason: string;
  proofCompetition: string;
  explanation: string;
};

const importedQuestions = questionFile.questions as ImportedQuestion[];

export const bundesligaPlayersLevelOneQuestions: QuizQuestion[] = importedQuestions.map(
  (question) => ({
    id: question.id,
    gameType: 'career-path',
    difficulty: 'easy',
    prompt: question.question,
    clue: 'Pflichtspiele für die erste Herrenmannschaft',
    options: question.options.map((option) => ({ id: option.id, label: option.text })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }),
);

export const bundesligaPlayersLevelOneMeta = {
  title: questionFile.title,
  verifiedAsOf: questionFile.verifiedAsOf,
  questionCount: questionFile.validation.questionCount,
  optionCount: questionFile.validation.optionCount,
  clubCount: questionFile.validation.uniqueTargetClubCount,
  playerCount: questionFile.validation.uniquePlayerCount,
} as const;
