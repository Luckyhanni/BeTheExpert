import AsyncStorage from '@react-native-async-storage/async-storage';

const CAREER_LEAGUE_KEY = 'be-the-expert.career.league.v1';

export function loadCareerLeagueId() {
  return AsyncStorage.getItem(CAREER_LEAGUE_KEY);
}

export function saveCareerLeagueId(leagueId: string) {
  return AsyncStorage.setItem(CAREER_LEAGUE_KEY, leagueId);
}
