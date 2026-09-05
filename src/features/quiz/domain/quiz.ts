export type Difficulty = 'easy' | 'normal' | 'expert' | 'impossible';

export type AnswerOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  gameType: 'career-path';
  difficulty: Difficulty;
  prompt: string;
  clue: string;
  options: AnswerOption[];
  correctOptionId: string;
  explanation: string;
};

const difficultyMultiplier: Record<Difficulty, number> = {
  easy: 1,
  normal: 1.25,
  expert: 1.6,
  impossible: 2,
};

export function isCorrectAnswer(question: QuizQuestion, optionId: string) {
  return question.correctOptionId === optionId;
}

export function calculateScore(
  question: QuizQuestion,
  optionId: string,
  responseTimeSeconds: number,
) {
  if (!isCorrectAnswer(question, optionId)) return 0;

  const speedBonus = Math.max(0, 15 - Math.max(0, responseTimeSeconds)) * 5;
  return Math.round((100 + speedBonus) * difficultyMultiplier[question.difficulty]);
}
