export type CareerLeague = {
  id: string;
  country: string;
  countryCode: string;
  name: string;
  tier: 1 | 2;
};

export const careerLeagues: CareerLeague[] = [
  { id: 'de-1', country: 'Deutschland', countryCode: 'DE', name: 'Bundesliga', tier: 1 },
  { id: 'de-2', country: 'Deutschland', countryCode: 'DE', name: '2. Bundesliga', tier: 2 },
  { id: 'en-1', country: 'England', countryCode: 'EN', name: 'Premier League', tier: 1 },
  { id: 'en-2', country: 'England', countryCode: 'EN', name: 'Championship', tier: 2 },
  { id: 'fr-1', country: 'Frankreich', countryCode: 'FR', name: 'Ligue 1', tier: 1 },
  { id: 'fr-2', country: 'Frankreich', countryCode: 'FR', name: 'Ligue 2', tier: 2 },
  { id: 'it-1', country: 'Italien', countryCode: 'IT', name: 'Serie A', tier: 1 },
  { id: 'it-2', country: 'Italien', countryCode: 'IT', name: 'Serie B', tier: 2 },
  { id: 'es-1', country: 'Spanien', countryCode: 'ES', name: 'LaLiga', tier: 1 },
  { id: 'es-2', country: 'Spanien', countryCode: 'ES', name: 'LaLiga 2', tier: 2 },
];

export const countries = ['Deutschland', 'England', 'Frankreich', 'Italien', 'Spanien'] as const;

export function findCareerLeague(id: string | null) {
  return careerLeagues.find((league) => league.id === id) ?? null;
}
