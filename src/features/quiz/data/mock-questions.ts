import type { QuizQuestion } from '../domain/quiz';

export const mockCareerQuestion: QuizQuestion = {
  id: 'career-path-001',
  gameType: 'career-path',
  difficulty: 'normal',
  prompt: 'Welcher Spieler gehört zu dieser Karriere?',
  clue: 'FC Schalke 04  →  Werder Bremen  →  Real Madrid  →  Arsenal',
  options: [
    { id: 'oezil', label: 'Mesut Özil' },
    { id: 'kroos', label: 'Toni Kroos' },
    { id: 'khedira', label: 'Sami Khedira' },
    { id: 'guendogan', label: 'İlkay Gündoğan' },
  ],
  correctOptionId: 'oezil',
  explanation:
    'Mesut Özil wechselte 2008 von Schalke zu Werder Bremen, 2010 zu Real Madrid und 2013 zum FC Arsenal.',
};
