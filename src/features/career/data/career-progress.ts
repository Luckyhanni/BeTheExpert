import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import { requireAccount } from '@/features/auth/data/account';

export type CareerProgress = Record<string, { bestPercent: number; passed: boolean }>;
const KEY = 'be-the-expert.career.progress.v1';
let writes: Promise<unknown> = Promise.resolve();

export async function loadCareerProgress(): Promise<CareerProgress> {
  if (isSupabaseConfigured) {
    const { client, userId } = await requireAccount();
    const { data, error } = await client.from('career_progress').select('pack_id,best_percent,passed').eq('user_id', userId);
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((row) => [row.pack_id, { bestPercent: row.best_percent, passed: row.passed }]));
  }
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return {};
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Ungültiger Fortschritt');
  const entries = Object.entries(value).filter(([, v]) => v && typeof v.bestPercent === 'number' && typeof v.passed === 'boolean');
  return Object.fromEntries(entries);
}

export function saveCareerResult(packId: string, percent: number, passed: boolean, expectedUserId?: string) {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) return Promise.reject(new Error('Ungültiges Ergebnis'));
  if (isSupabaseConfigured) return saveCloudResult(packId, percent, expectedUserId);
  const write = writes.catch(() => undefined).then(async () => {
    const current = await loadCareerProgress();
    current[packId] = {
      bestPercent: Math.max(current[packId]?.bestPercent ?? 0, percent),
      passed: (current[packId]?.passed ?? false) || passed,
    };
    await AsyncStorage.setItem(KEY, JSON.stringify(current));
  });
  writes = write;
  return write;
}

async function saveCloudResult(packId: string, percent: number, expectedUserId?: string) {
  const { client, userId } = await requireAccount(expectedUserId);
  const { error } = await client.rpc('save_career_result', { p_user_id: userId, p_pack_id: packId, p_percent: percent });
  if (error) throw error;
}
