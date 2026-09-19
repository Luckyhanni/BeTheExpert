import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { AppScreen } from '@/components/ui/app-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import { loadCareerProgress } from '@/features/career/data/career-progress';
import { findCareerPack } from '@/features/quiz/data/career-packs';
import { CareerLevelScreen } from '@/features/quiz/screens/career-level-screen';
import { colors } from '@/theme/tokens';
import { CAREER_PLAYTEST_UNLOCK_ALL } from '@/features/career/data/career-settings';

export function PlayScreen() {
  const params = useLocalSearchParams<{ leagueId?: string; categoryId?: string; level?: string }>();
  const pack = findCareerPack(params.leagueId, params.categoryId, params.level);
  const router = useRouter();
  const [access, setAccess] = useState<{ id: string; allowed: boolean; error?: string } | null>(null);
  useEffect(() => {
    if (!pack || CAREER_PLAYTEST_UNLOCK_ALL) return;
    let active = true;
    loadCareerProgress().then((progress) => {
      if (active) setAccess({ id: pack.id, allowed: pack.level === 1 || !!progress[`${pack.leagueId}:${pack.categoryId}:${pack.level - 1}`]?.passed });
    }).catch(() => {
      if (active) setAccess({ id: pack.id, allowed: pack.level === 1, error: 'Fortschritt konnte nicht geladen werden.' });
    });
    return () => { active = false; };
  }, [pack]);
  if (pack && (CAREER_PLAYTEST_UNLOCK_ALL || (access?.id === pack.id && access.allowed))) return <CareerLevelScreen key={pack.id} pack={pack} />;
  return <AppScreen>
    <Text style={{ color: colors.text, fontSize: 22 }}>
      {!pack ? 'Für diese Auswahl sind noch keine Fragen verfügbar.' : access?.id !== pack.id ? 'Fortschritt wird geladen …' : access.error ?? 'Bestehe zuerst das vorherige Level mit mindestens 80 %.'}
    </Text>
    <PrimaryButton label="Zur Karriere" onPress={() => router.replace('/career')} />
  </AppScreen>;
}
