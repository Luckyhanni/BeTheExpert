import { describe, expect, it } from 'vitest';

import { careerCategories, formatLevelExample } from './career-path';

describe('career path', () => {
  it('contains ten unique knowledge categories', () => {
    expect(careerCategories).toHaveLength(10);
    expect(new Set(careerCategories.map((category) => category.id)).size).toBe(10);
  });

  it('contains four ordered difficulty levels in every category', () => {
    for (const category of careerCategories) {
      expect(category.levels.map((level) => level.level)).toEqual([1, 2, 3, 4]);
    }
  });

  it('limits every impossible mode to ten seconds', () => {
    for (const category of careerCategories) {
      expect(category.levels.find((level) => level.level === 4)?.timeLimitSeconds).toBe(10);
    }
  });

  it('adapts example text to the selected league', () => {
    expect(formatLevelExample('Frage zur {league}', 'Ligue 1')).toBe('Frage zur Ligue 1');
  });
});
