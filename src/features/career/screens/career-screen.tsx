import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import {
  careerLeagues,
  countries,
  findCareerLeague,
  type CareerLeague,
} from '@/features/career/data/leagues';
import {
  loadCareerLeagueId,
  saveCareerLeagueId,
} from '@/features/career/data/career-storage';
import { colors, radii, spacing } from '@/theme/tokens';

export function CareerScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedLeague, setSavedLeague] = useState<CareerLeague | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<CareerLeague | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadCareerLeagueId()
      .then((leagueId) => {
        if (isMounted) setSavedLeague(findCareerLeague(leagueId));
      })
      .catch(() => {
        if (isMounted) setError('Deine gespeicherte Karriere konnte nicht geladen werden.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function confirmLeague() {
    if (!selectedLeague || isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      await saveCareerLeagueId(selectedLeague.id);
      setSavedLeague(selectedLeague);
    } catch {
      setError('Die Auswahl konnte nicht gespeichert werden. Bitte versuche es erneut.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <AppScreen>
        <View style={styles.loadingState}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.loadingText}>Karriere wird geladen</Text>
        </View>
      </AppScreen>
    );
  }

  if (savedLeague) return <CareerOverview league={savedLeague} />;

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DEINE KARRIERE</Text>
        <Text style={styles.title}>Wähle deine Liga</Text>
        <Text style={styles.intro}>
          Hier beginnt dein Weg zum Fußballexperten. Entscheide dich für eine Liga.
        </Text>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeIcon}>!</Text>
        <Text style={styles.noticeText}>Diese Auswahl gilt für deine erste Karriere.</Text>
      </View>

      {countries.map((country) => (
        <LeagueGroup
          country={country}
          key={country}
          onSelect={setSelectedLeague}
          selectedLeagueId={selectedLeague?.id ?? null}
        />
      ))}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.confirmArea}>
        <Text style={styles.selectionSummary}>
          {selectedLeague
            ? `${selectedLeague.name} · ${selectedLeague.country}`
            : 'Wähle zuerst eine Liga aus'}
        </Text>
        <View style={!selectedLeague || isSaving ? styles.disabled : undefined}>
          <PrimaryButton
            label={isSaving ? 'Wird gespeichert …' : 'Karriere beginnen  →'}
            onPress={confirmLeague}
          />
        </View>
      </View>
    </AppScreen>
  );
}

function LeagueGroup({
  country,
  selectedLeagueId,
  onSelect,
}: {
  country: (typeof countries)[number];
  selectedLeagueId: string | null;
  onSelect: (league: CareerLeague) => void;
}) {
  const leagues = useMemo(
    () => careerLeagues.filter((league) => league.country === country),
    [country],
  );

  return (
    <View style={styles.countryGroup}>
      <View style={styles.countryHeader}>
        <View style={styles.countryCodeBadge}>
          <Text style={styles.countryCode}>{leagues[0].countryCode}</Text>
        </View>
        <Text style={styles.countryName}>{country}</Text>
      </View>
      <View style={styles.leagueRow}>
        {leagues.map((league) => {
          const isSelected = league.id === selectedLeagueId;

          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              key={league.id}
              onPress={() => onSelect(league)}
              style={({ pressed }) => [
                styles.leagueCard,
                isSelected && styles.leagueCardSelected,
                pressed && styles.pressed,
              ]}>
              <View style={[styles.tierBadge, isSelected && styles.tierBadgeSelected]}>
                <Text style={[styles.tierText, isSelected && styles.tierTextSelected]}>
                  {league.tier}. LIGA
                </Text>
              </View>
              <Text style={styles.leagueName}>{league.name}</Text>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected ? <View style={styles.radioDot} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function CareerOverview({ league }: { league: CareerLeague }) {
  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DEINE KARRIERE</Text>
        <Text style={styles.title}>Bereit für den Aufstieg?</Text>
      </View>

      <LinearGradient colors={['#1C482F', '#0C2117', '#08130E']} style={styles.heroCard}>
        <View style={styles.heroCountryBadge}>
          <Text style={styles.heroCountryCode}>{league.countryCode}</Text>
        </View>
        <Text style={styles.heroLabel}>DEINE LIGA</Text>
        <Text style={styles.heroTitle}>{league.name}</Text>
        <Text style={styles.heroCountry}>{league.country} · {league.tier}. Liga</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Spieltag</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Punkte</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>10.</Text>
          <Text style={styles.statLabel}>Rang</Text>
        </View>
      </View>

      <View style={styles.nextStepCard}>
        <Text style={styles.nextStepLabel}>NÄCHSTE AUFGABE</Text>
        <Text style={styles.nextStepTitle}>Saisonauftakt</Text>
        <Text style={styles.nextStepText}>Beweise dein Wissen und sammle die ersten Punkte.</Text>
        <PrimaryButton label="Aufgabe starten  →" onPress={() => {}} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loadingState: { minHeight: 520, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { color: colors.textMuted, fontSize: 17, fontWeight: '700' },
  header: { gap: spacing.sm, paddingTop: spacing.md },
  eyebrow: { color: colors.accent, fontSize: 15, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', letterSpacing: -0.8 },
  intro: { color: colors.textMuted, fontSize: 17, lineHeight: 25, maxWidth: 520 },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noticeIcon: {
    width: 28,
    height: 28,
    color: colors.background,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 28,
    textAlign: 'center',
    borderRadius: 14,
    backgroundColor: colors.accent,
  },
  noticeText: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700' },
  countryGroup: { gap: spacing.sm },
  countryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  countryCodeBadge: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countryCode: { color: colors.accent, fontSize: 13, fontWeight: '900' },
  countryName: { color: colors.text, fontSize: 21, fontWeight: '900' },
  leagueRow: { flexDirection: 'row', gap: spacing.md },
  leagueCard: {
    flex: 1,
    minHeight: 128,
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  leagueCardSelected: {
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.surfaceElevated,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
  },
  tierBadgeSelected: { backgroundColor: colors.accent },
  tierText: { color: colors.textMuted, fontSize: 12, fontWeight: '900', letterSpacing: 0.8 },
  tierTextSelected: { color: colors.background },
  leagueName: { color: colors.text, fontSize: 18, fontWeight: '900' },
  radio: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  radioSelected: { borderColor: colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  confirmArea: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selectionSummary: { color: colors.text, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  disabled: { opacity: 0.4, pointerEvents: 'none' },
  errorText: { color: colors.danger, fontSize: 15, fontWeight: '700' },
  heroCard: {
    minHeight: 270,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#315A40',
  },
  heroCountryBadge: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 39,
    borderWidth: 3,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  heroCountryCode: { color: colors.accent, fontSize: 25, fontWeight: '900' },
  heroLabel: { color: colors.accent, fontSize: 14, fontWeight: '900', letterSpacing: 1.6 },
  heroTitle: { color: colors.text, fontSize: 32, fontWeight: '900', textAlign: 'center' },
  heroCountry: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  statValue: { color: colors.text, fontSize: 25, fontWeight: '900' },
  statLabel: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
  nextStepCard: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  nextStepLabel: { color: colors.accent, fontSize: 14, fontWeight: '900', letterSpacing: 1.3 },
  nextStepTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  nextStepText: { color: colors.textMuted, fontSize: 16, lineHeight: 23 },
});
