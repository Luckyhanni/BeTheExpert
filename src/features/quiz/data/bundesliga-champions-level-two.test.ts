import { describe, expect, it } from 'vitest';

import questionFile from './de-bundesliga-champions-level-2.json';
import {
  bundesligaChampionClubs,
  findChampionByInput,
  normalizeChampionName,
} from './bundesliga-champions-level-two';

describe('Bundesliga champions level two', () => {
  it('contains 30 unique answers', () => {
    expect(bundesligaChampionClubs).toHaveLength(30);
    expect(new Set(bundesligaChampionClubs.map((club) => club.id)).size).toBe(30);
  });

  it('normalizes punctuation, case and German characters', () => {
    expect(normalizeChampionName('  BAYERN MÜNCHEN  ')).toBe('bayernmuenchen');
    expect(findChampionByInput('Bayern Muenchen')?.id).toBe('bte_club_002');
    expect(findChampionByInput('1.FC Nürnberg')?.id).toBe('bte_club_040');
  });

  it('passes every matching test supplied with the data', () => {
    for (const testCase of questionFile.validation.matchingTests) {
      expect(findChampionByInput(testCase.input)?.id ?? null, testCase.input).toBe(
        testCase.expectedClubId,
      );
    }
  });

  it('maps aliases to one club while keeping distinct clubs separate', () => {
    expect(findChampionByInput('VfB Leipzig')?.id).toBe(findChampionByInput('Lok Leipzig')?.id);
    expect(findChampionByInput('KSC')?.id).not.toBe(findChampionByInput('KFV')?.id);
  });
});
