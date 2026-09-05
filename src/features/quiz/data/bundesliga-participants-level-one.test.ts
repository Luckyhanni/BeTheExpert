import { describe, expect, it } from 'vitest';

import {
  bundesligaParticipantsLevelOneMeta,
  bundesligaParticipantsLevelOneQuestions,
} from './bundesliga-participants-level-one';

describe('Bundesliga participants level one', () => {
  it('contains one question for every participant', () => {
    expect(bundesligaParticipantsLevelOneMeta.participantCount).toBe(59);
    expect(bundesligaParticipantsLevelOneQuestions).toHaveLength(59);
  });

  it('has four options and one valid answer per question', () => {
    for (const question of bundesligaParticipantsLevelOneQuestions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
    }
  });

  it('does not repeat question or club ids', () => {
    const questionIds = bundesligaParticipantsLevelOneQuestions.map((question) => question.id);
    const optionIds = bundesligaParticipantsLevelOneQuestions.flatMap((question) =>
      question.options.map((option) => option.id),
    );

    expect(new Set(questionIds).size).toBe(59);
    expect(new Set(optionIds).size).toBe(236);
  });
});
