export type CareerAnswer = { id: string; label: string; aliases: string[] };
export type CareerRound = {
  id: string;
  mode: 'choice' | 'set' | 'text' | 'order';
  prompt: string;
  hint: string;
  answers: CareerAnswer[];
  options: CareerAnswer[];
  explanation: string;
  sources: string[];
};
export type CareerPack = {
  id: string;
  leagueId: string;
  categoryId: string;
  level: number;
  title: string;
  scope: string;
  verifiedAsOf: string;
  timeLimitSeconds: number | null;
  rounds: CareerRound[];
};

export function normalizeAnswer(value: string) {
  return value.toLocaleLowerCase('de-DE').replaceAll('ä', 'ae').replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue').replaceAll('ß', 'ss').normalize('NFKD')
    .replace(/\p{M}/gu, '').replaceAll('ł', 'l').replaceAll('ø', 'o')
    .replace(/[^a-z0-9]/g, '');
}

export function matchAnswer(input: string, answers: CareerAnswer[]) {
  const normalized = normalizeAnswer(input);
  if (!normalized) return null;
  const matches = answers.filter((answer) => [answer.label, ...answer.aliases]
    .some((alias) => normalizeAnswer(alias) === normalized));
  return matches.length === 1 ? matches[0] : null;
}

export function scoreRound(round: CareerRound, submittedIds: string[]) {
  if (round.mode === 'order') {
    return submittedIds.length === round.answers.length && round.answers.every((a, i) => a.id === submittedIds[i]) ? 1 : 0;
  }
  const unique = new Set(submittedIds);
  if ([...unique].some((id) => !round.answers.some((a) => a.id === id))) return 0;
  return round.answers.filter((a) => unique.has(a.id)).length / round.answers.length;
}

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createCareerSession(pack: CareerPack, random = Math.random): CareerRound[] {
  // Full-list rounds remain complete. Other modes use ten distinct tasks per attempt.
  return shuffle(pack.rounds, random).slice(0, 10).map((round) => ({ ...round, options: shuffle(round.options, random) }));
}

export function passedCareerLevel(score: number, count: number) {
  return count > 0 && score / count >= 0.8;
}
