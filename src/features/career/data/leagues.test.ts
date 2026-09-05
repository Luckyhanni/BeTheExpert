import { describe, expect, it } from 'vitest';

import { careerLeagues, countries, findCareerLeague } from './leagues';

describe('career leagues', () => {
  it('offers exactly two leagues for each of the five countries', () => {
    expect(careerLeagues).toHaveLength(10);

    for (const country of countries) {
      expect(careerLeagues.filter((league) => league.country === country)).toHaveLength(2);
    }
  });

  it('offers a first and second tier in every country', () => {
    for (const country of countries) {
      const tiers = careerLeagues
        .filter((league) => league.country === country)
        .map((league) => league.tier)
        .sort();

      expect(tiers).toEqual([1, 2]);
    }
  });

  it('rejects unknown saved league ids', () => {
    expect(findCareerLeague('unknown')).toBeNull();
    expect(findCareerLeague('de-1')?.name).toBe('Bundesliga');
  });
});
