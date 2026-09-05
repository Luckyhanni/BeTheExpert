import { describe, expect, it } from 'vitest';

import {
  bundesligaChampionsLevelOneMeta,
  bundesligaChampionsLevelOneQuestions,
} from './bundesliga-champions-level-one';

describe('Bundesliga champions level one question set', () => {
  it('contains all 30 imported questions', () => {
    expect(bundesligaChampionsLevelOneMeta.questionCount).toBe(30);
    expect(bundesligaChampionsLevelOneQuestions).toHaveLength(30);
  });

  it('has four options and one valid answer per question', () => {
    for (const question of bundesligaChampionsLevelOneQuestions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
    }
  });

  it('uses unique question and option ids', () => {
    const questionIds = bundesligaChampionsLevelOneQuestions.map((question) => question.id);
    const optionIds = bundesligaChampionsLevelOneQuestions.flatMap((question) =>
      question.options.map((option) => option.id),
    );

    expect(new Set(questionIds).size).toBe(30);
    expect(new Set(optionIds).size).toBe(120);
  });
});
