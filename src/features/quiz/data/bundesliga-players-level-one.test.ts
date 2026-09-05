import { describe, expect, it } from 'vitest';

import {
  bundesligaPlayersLevelOneMeta,
  bundesligaPlayersLevelOneQuestions,
} from './bundesliga-players-level-one';

describe('Bundesliga players level one', () => {
  it('contains one question for every target club', () => {
    expect(bundesligaPlayersLevelOneMeta.clubCount).toBe(40);
    expect(bundesligaPlayersLevelOneQuestions).toHaveLength(40);
  });

  it('has four options and one valid answer per question', () => {
    for (const question of bundesligaPlayersLevelOneQuestions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
    }
  });

  it('does not repeat question or player ids', () => {
    const questionIds = bundesligaPlayersLevelOneQuestions.map((question) => question.id);
    const optionIds = bundesligaPlayersLevelOneQuestions.flatMap((question) =>
      question.options.map((option) => option.id),
    );

    expect(new Set(questionIds).size).toBe(40);
    expect(optionIds).toHaveLength(160);
    expect(new Set(optionIds).size).toBe(160);
  });
});
