import { describe, expect, it } from 'vitest';
import { createCareerSession, matchAnswer, normalizeAnswer, passedCareerLevel, scoreRound, type CareerRound } from './career';
import { careerPacks, findCareerPack } from '../data/career-packs';

describe('career answer rules', () => {
  const answers = [{ id: 'mueller', label: 'Thomas Müller', aliases: ['Thomas Mueller'] }, { id: 'gomez', label: 'Mario Gómez', aliases: ['Gomez'] }];
  const round: CareerRound = { id: 'test', mode: 'set', prompt: '', hint: '', answers, options: [], explanation: '', sources: [] };
  it('normalizes German spellings, accents and punctuation without guessing names', () => {
    expect(matchAnswer(' thomas mueller ', answers)?.id).toBe('mueller');
    expect(matchAnswer('Mario Gomez', answers)?.id).toBe('gomez');
    expect(matchAnswer('Müller', answers)).toBeNull();
    expect(matchAnswer('', answers)).toBeNull();
    expect(normalizeAnswer('Džeko')).toBe('dzeko');
  });
  it('rejects ambiguous aliases', () => {
    expect(matchAnswer('Müller', answers.map((a) => ({ ...a, aliases: ['Müller'] })))).toBeNull();
  });
  it('gives partial set credit, prevents duplicate credit and rejects foreign IDs', () => {
    expect(scoreRound(round, ['mueller', 'mueller'])).toBe(0.5);
    expect(scoreRound(round, ['gomez', 'mueller'])).toBe(1);
    expect(scoreRound(round, ['other'])).toBe(0);
    expect(scoreRound(round, [])).toBe(0);
  });
  it('requires the entire correct sequence for sorting', () => {
    expect(scoreRound({ ...round, mode: 'order' }, ['mueller', 'gomez'])).toBe(1);
    expect(scoreRound({ ...round, mode: 'order' }, ['gomez', 'mueller'])).toBe(0);
    expect(scoreRound({ ...round, mode: 'order' }, ['mueller'])).toBe(0);
  });
  it('unlocks only from 80 percent with nonempty rounds', () => {
    expect(passedCareerLevel(8, 10)).toBe(true);
    expect(passedCareerLevel(7.99, 10)).toBe(false);
    expect(passedCareerLevel(0, 0)).toBe(false);
  });
});

describe('reviewed German career content', () => {
  it('covers all four levels of all four requested themes in both leagues', () => {
    expect(careerPacks).toHaveLength(32);
    for (const league of ['de-1', 'de-2']) for (const category of ['champions', 'participants', 'top-scorers', 'players']) {
      for (const level of [1, 2, 3, 4]) expect(findCareerPack(league, category, level)?.rounds.length).toBeGreaterThan(0);
    }
  });
  for (const pack of careerPacks) it(`${pack.id}: stable IDs, usable answers, evidence and unambiguous options`, () => {
    expect(new Set(pack.rounds.map((r) => r.id)).size).toBe(pack.rounds.length);
    expect(pack.timeLimitSeconds).toBe(pack.level === 4 ? 10 : null);
    for (const round of pack.rounds) {
      expect(round.sources.length).toBeGreaterThan(0);
      for (const source of round.sources) expect(new URL(source).protocol).toBe('https:');
      expect(round.answers.length).toBeGreaterThan(0);
      expect(new Set(round.answers.map((a) => a.id)).size).toBe(round.answers.length);
      for (const answer of round.answers) expect(matchAnswer(answer.label, round.answers)?.id).toBe(answer.id);
      if (round.mode === 'choice') {
        expect(round.options).toHaveLength(4);
        expect(round.answers).toHaveLength(1);
        expect(new Set(round.options.map((a) => a.id)).size).toBe(4);
        expect(round.options.filter((o) => o.id === round.answers[0].id)).toHaveLength(1);
      }
      if (round.mode === 'order') expect(round.options.map((a) => a.id).sort()).toEqual(round.answers.map((a) => a.id).sort());
    }
    if (pack.level === 1) {
      const options = pack.rounds.flatMap((r) => r.options.map((o) => o.id));
      expect(new Set(options).size).toBe(options.length);
    }
  });
  it('keeps all seasonal co-winners and distinguishes North/South', () => {
    const first = findCareerPack('de-1', 'top-scorers', 3)!;
    expect(first.rounds).toHaveLength(63);
    expect(first.rounds.find((r) => r.prompt.includes('2022/23'))?.answers.map((a) => a.label).sort()).toEqual(['Christopher Nkunku', 'Niclas Füllkrug']);
    const second = findCareerPack('de-2', 'top-scorers', 3)!;
    expect(second.rounds).toHaveLength(60);
    expect(second.rounds.find((r) => r.prompt.includes('2023/24'))?.answers).toHaveLength(3);
    expect(second.rounds.filter((r) => r.prompt.includes('1991/92'))).toHaveLength(2);
  });
  it('never uses another known champion, participant or top scorer as a distractor', () => {
    for (const league of ['de-1', 'de-2']) for (const category of ['champions', 'participants', 'top-scorers']) {
      const recognition = findCareerPack(league, category, 1)!;
      const complete = findCareerPack(league, category, 2)!.rounds[0].answers;
      for (const round of recognition.rounds) {
        expect(round.options.filter((o) => matchAnswer(o.label, complete))).toHaveLength(1);
      }
    }
  });
  it('samples distinct rounds and shuffles choices without changing solution IDs', () => {
    const pack = findCareerPack('de-2', 'champions', 1)!;
    const original = JSON.stringify(pack);
    const session = createCareerSession(pack, () => 0.25);
    expect(session).toHaveLength(10);
    expect(new Set(session.map((r) => r.id)).size).toBe(10);
    expect(JSON.stringify(pack)).toBe(original);
    for (const round of session) expect(round.options.some((a) => a.id === round.answers[0].id)).toBe(true);
  });
});
