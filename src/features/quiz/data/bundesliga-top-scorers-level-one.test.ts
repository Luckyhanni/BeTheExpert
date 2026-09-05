import { describe, expect, it } from 'vitest';

import {
  bundesligaTopScorersLevelOneMeta,
  bundesligaTopScorersLevelOneQuestions,
} from './bundesliga-top-scorers-level-one';

describe('Bundesliga top scorers level one', () => {
  it('contains one question for every title winner', () => {
    expect(bundesligaTopScorersLevelOneMeta.topScorerCount).toBe(48);
    expect(bundesligaTopScorersLevelOneQuestions).toHaveLength(48);
  });

  it('has four options and one valid answer per question', () => {
    for (const question of bundesligaTopScorersLevelOneQuestions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
    }
  });

  it('does not repeat question or player ids', () => {
    const questionIds = bundesligaTopScorersLevelOneQuestions.map((question) => question.id);
    const optionIds = bundesligaTopScorersLevelOneQuestions.flatMap((question) =>
      question.options.map((option) => option.id),
    );

    expect(new Set(questionIds).size).toBe(48);
    expect(new Set(optionIds).size).toBe(192);
  });
});
