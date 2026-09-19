import { getSupabaseClient } from '@/lib/supabase';

/** Capture the owner before starting any account-specific work. Never fall back to guest data. */
export async function requireAccount(expectedUserId?: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Die Anmeldung ist noch nicht eingerichtet.');
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error('Bitte melde dich erneut an.');
  if (expectedUserId && data.session.user.id !== expectedUserId) throw new Error('Das Konto wurde gewechselt.');
  return { client, userId: data.session.user.id };
}

export async function loadDisplayName() {
  const { client, userId } = await requireAccount();
  const { data, error } = await client.from('profiles').select('display_name').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data?.display_name as string | undefined;
}

export async function saveDisplayName(name: string, expectedUserId?: string) {
  const displayName = name.trim();
  if (displayName.length < 2 || displayName.length > 32) throw new Error('Bitte verwende 2 bis 32 Zeichen.');
  const { client, userId } = await requireAccount(expectedUserId);
  const { error } = await client.from('profiles').upsert({ user_id: userId, display_name: displayName }, { onConflict: 'user_id' });
  if (error) throw error;
}
