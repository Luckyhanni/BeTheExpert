import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { loadCareerProgress } from '@/features/career/data/career-progress';
import { loadDisplayName } from '@/features/auth/data/account';
import { isSupabaseConfigured } from '@/lib/supabase';

export function useAccountSummary() {
  const [summary, setSummary] = useState({ name: '', passed: 0, loading: true, error: false });
  useFocusEffect(useCallback(() => {
    let active = true;
    Promise.all([isSupabaseConfigured ? loadDisplayName() : Promise.resolve('Lokaler Spieler'), loadCareerProgress()])
      .then(([name, progress]) => { if (active) setSummary({ name: name ?? 'Experte', passed: Object.values(progress).filter((p) => p.passed).length, loading: false, error: false }); })
      .catch(() => { if (active) setSummary((current) => ({ ...current, loading: false, error: true })); });
    return () => { active = false; };
  }, []));
  return summary;
}
