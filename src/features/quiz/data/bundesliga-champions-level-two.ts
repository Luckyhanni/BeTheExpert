import questionFile from './de-bundesliga-champions-level-2.json';

export type ChampionClub = {
  id: string;
  name: string;
  firstChampionshipYear: number;
  acceptedNames: string[];
};

export const bundesligaChampionClubs = questionFile.clubs as ChampionClub[];

export const bundesligaChampionsLevelTwoMeta = {
  title: questionFile.questions[0].title,
  question: questionFile.questions[0].question,
  playerHint: questionFile.questions[0].playerHint,
  answerCount: questionFile.questions[0].answerCount,
  verifiedAsOf: questionFile.verifiedAsOf,
  lastCompletedSeason: questionFile.lastCompletedSeason,
  scope: questionFile.scope.included,
} as const;

export function normalizeChampionName(value: string) {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase('de-DE')
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .replace(/[^a-z0-9]/g, '');
}

const championsByAlias = new Map<string, ChampionClub>();

for (const club of bundesligaChampionClubs) {
  for (const acceptedName of club.acceptedNames) {
    const normalizedName = normalizeChampionName(acceptedName);
    const existingClub = championsByAlias.get(normalizedName);

    if (existingClub && existingClub.id !== club.id) {
      throw new Error(`Doppeldeutiger Meister-Alias: ${acceptedName}`);
    }

    championsByAlias.set(normalizedName, club);
  }
}

export function findChampionByInput(input: string) {
  return championsByAlias.get(normalizeChampionName(input)) ?? null;
}
