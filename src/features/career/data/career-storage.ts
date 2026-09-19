import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import { requireAccount } from '@/features/auth/data/account';

const CAREER_LEAGUE_KEY = 'be-the-expert.career.league.v1';

export async function loadCareerLeagueId() {
  if (isSupabaseConfigured) {
    const { client, userId } = await requireAccount();
    const { data, error } = await client.from('account_settings').select('league_id').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return (data?.league_id as string | null) ?? null;
  }
  return AsyncStorage.getItem(CAREER_LEAGUE_KEY);
}

export async function saveCareerLeagueId(leagueId: string, expectedUserId?: string) {
  if (isSupabaseConfigured) {
    const { client, userId } = await requireAccount(expectedUserId);
    const { error } = await client.from('account_settings').upsert({ user_id: userId, league_id: leagueId }, { onConflict: 'user_id' });
    if (error) throw error;
    return;
  }
  return AsyncStorage.setItem(CAREER_LEAGUE_KEY, leagueId);
}
