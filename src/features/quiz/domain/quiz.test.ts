import { describe, expect, it } from 'vitest';

import { mockCareerQuestion } from '../data/mock-questions';
import { calculateScore, isCorrectAnswer } from './quiz';

describe('quiz scoring', () => {
  it('recognizes the correct answer', () => {
    expect(isCorrectAnswer(mockCareerQuestion, 'oezil')).toBe(true);
    expect(isCorrectAnswer(mockCareerQuestion, 'kroos')).toBe(false);
  });

  it('awards more points for a fast correct answer', () => {
    expect(calculateScore(mockCareerQuestion, 'oezil', 3)).toBeGreaterThan(
      calculateScore(mockCareerQuestion, 'oezil', 14),
    );
  });

  it('awards no points for a wrong answer', () => {
    expect(calculateScore(mockCareerQuestion, 'kroos', 1)).toBe(0);
  });
});
