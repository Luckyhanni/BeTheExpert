import { describe, expect, it } from 'vitest';

import { careerCategories, careerLevels } from './career-path';

describe('career path', () => {
  it('contains ten unique knowledge categories', () => {
    expect(careerCategories).toHaveLength(10);
    expect(new Set(careerCategories.map((category) => category.id)).size).toBe(10);
  });

  it('contains five ordered difficulty levels', () => {
    expect(careerLevels.map((level) => level.level)).toEqual([1, 2, 3, 4, 5]);
  });

  it('limits impossible mode to ten seconds', () => {
    expect(careerLevels.find((level) => level.level === 4)?.timeLimitSeconds).toBe(10);
  });
});
