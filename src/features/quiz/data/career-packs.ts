import type { CareerPack } from '@/features/quiz/domain/career';
import data from './german-career-packs.json';

export const careerPacks: CareerPack[] = data as CareerPack[];
export function findCareerPack(leagueId?: string, categoryId?: string, level?: string | number) {
  return careerPacks.find((p) => p.leagueId === leagueId && p.categoryId === categoryId && p.level === Number(level)) ?? null;
}
