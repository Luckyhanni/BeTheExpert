import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { ActivityIndicator, AppState, Platform, Text } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { AppScreen } from '@/components/ui/app-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import { LoginScreen } from './screens/login-screen';
import { colors } from '@/theme/tokens';

const AuthContext = createContext<{ session: Session | null }>({ session: null });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;
    let active = true;
    let eventReceived = false;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, next) => {
      eventReceived = true;
      if (active) { setSession(next); setLoading(false); setError(false); }
    });
    client.auth.getSession().then(({ data, error: failure }) => {
      if (!active || eventReceived) return;
      setSession(data.session); setError(!!failure); setLoading(false);
    }).catch(() => { if (active && !eventReceived) { setError(true); setLoading(false); } });
    const refresh = (state: string) => {
      if (state === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    };
    if (Platform.OS !== 'web') refresh(AppState.currentState);
    const listener = AppState.addEventListener('change', (state) => { if (Platform.OS !== 'web') refresh(state); });
    return () => { active = false; subscription.unsubscribe(); listener.remove(); if (Platform.OS !== 'web') client.auth.stopAutoRefresh(); };
  }, [attempt]);

  if (loading) return <AppScreen><ActivityIndicator color={colors.accent} /><Text style={{ color: colors.text }}>Anmeldung wird geladen …</Text></AppScreen>;
  if (error) return <AppScreen><Text style={{ color: colors.text }}>Deine Anmeldung konnte nicht geladen werden.</Text><PrimaryButton label="Erneut versuchen" onPress={() => { setError(false); setLoading(true); setAttempt((v) => v + 1); }} /></AppScreen>;
  if (isSupabaseConfigured && !session) return <LoginScreen />;
  // Account changes unmount every feature, including pending rounds and previously loaded progress.
  return <AuthContext.Provider key={session?.user.id ?? 'local'} value={{ session }}>{children}</AuthContext.Provider>;
}
