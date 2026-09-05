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
import {
  careerCategories,
  careerLevels,
  type CareerCategory,
} from '@/features/career/data/career-path';
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
  const [activeCategory, setActiveCategory] = useState<CareerCategory | null>(null);

  if (activeCategory) {
    return (
      <CategoryLevels
        category={activeCategory}
        league={league}
        onBack={() => setActiveCategory(null)}
      />
    );
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DEINE KARRIERE</Text>
        <Text style={styles.title}>{league.name}</Text>
        <Text style={styles.intro}>Wähle einen Wissensbereich und meistere seine fünf Level.</Text>
      </View>

      <LinearGradient colors={['#1C482F', '#0C2117', '#08130E']} style={styles.heroCard}>
        <View style={styles.heroCountryBadge}>
          <Text style={styles.heroCountryCode}>{league.countryCode}</Text>
        </View>
        <Text style={styles.heroLabel}>KARRIERE-FORTSCHRITT</Text>
        <Text style={styles.heroTitle}>0 / 50 Level</Text>
        <Text style={styles.heroCountry}>{league.country} · Deine Liga</Text>
      </LinearGradient>

      <View style={styles.categoryHeading}>
        <Text style={styles.categoryHeadingTitle}>10 Wissensbereiche</Text>
        <Text style={styles.categoryHeadingCount}>0 %</Text>
      </View>

      <View style={styles.categoryGrid}>
        {careerCategories.map((category, index) => (
          <Pressable
            accessibilityRole="button"
            key={category.id}
            onPress={() => setActiveCategory(category)}
            style={({ pressed }) => [styles.categoryCard, pressed && styles.pressed]}>
            <View style={styles.categoryTopRow}>
              <View style={styles.categorySymbolBox}>
                <Text style={styles.categorySymbol}>{category.symbol}</Text>
              </View>
              <Text style={styles.categoryNumber}>{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
            <View style={styles.categoryProgressRow}>
              <View style={styles.categoryProgressTrack} />
              <Text style={styles.categoryProgressText}>0 / 5</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

function CategoryLevels({
  category,
  league,
  onBack,
}: {
  category: CareerCategory;
  league: CareerLeague;
  onBack: () => void;
}) {
  return (
    <AppScreen>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Alle Bereiche</Text>
      </Pressable>

      <View style={styles.levelHeader}>
        <View style={styles.levelHeroSymbol}>
          <Text style={styles.levelHeroSymbolText}>{category.symbol}</Text>
        </View>
        <View style={styles.levelHeaderCopy}>
          <Text style={styles.eyebrow}>{league.name.toUpperCase()}</Text>
          <Text style={styles.title}>{category.title}</Text>
          <Text style={styles.intro}>{category.description}</Text>
        </View>
      </View>

      <View style={styles.levelList}>
        {careerLevels.map((level) => {
          const isAvailable = level.level === 1;

          return (
            <View
              accessibilityLabel={`Level ${level.level}: ${level.title}`}
              key={level.level}
              style={[styles.levelCard, !isAvailable && styles.levelCardLocked]}>
              <View style={[styles.levelNumber, isAvailable && styles.levelNumberAvailable]}>
                <Text style={[styles.levelNumberText, isAvailable && styles.levelNumberTextAvailable]}>
                  {level.level}
                </Text>
              </View>
              <View style={styles.levelCopy}>
                <View style={styles.levelTitleRow}>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={isAvailable ? styles.levelStatusAvailable : styles.levelStatusLocked}>
                    {isAvailable ? 'OFFEN' : 'GESPERRT'}
                  </Text>
                </View>
                <Text style={styles.levelMode}>
                  {level.mode}{level.timeLimitSeconds ? ` · ${level.timeLimitSeconds} SEK.` : ''}
                </Text>
                <Text style={styles.levelDescription}>{level.description}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.levelHint}>
        <Text style={styles.levelHintText}>Schließe ein Level ab, um das nächste freizuschalten.</Text>
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
  categoryHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryHeadingTitle: { color: colors.text, fontSize: 23, fontWeight: '900' },
  categoryHeadingCount: { color: colors.accent, fontSize: 16, fontWeight: '900' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  categoryCard: {
    width: '47.5%',
    minHeight: 190,
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categorySymbolBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.surfaceElevated,
  },
  categorySymbol: { color: colors.accent, fontSize: 24, fontWeight: '900' },
  categoryNumber: { color: colors.textMuted, fontSize: 15, fontWeight: '900' },
  categoryTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  categoryDescription: { flex: 1, color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  categoryProgressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  categoryProgressTrack: {
    flex: 1,
    height: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
  },
  categoryProgressText: { color: colors.textMuted, fontSize: 13, fontWeight: '800' },
  backButton: { alignSelf: 'flex-start', paddingVertical: spacing.sm },
  backButtonText: { color: colors.accent, fontSize: 16, fontWeight: '900' },
  levelHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  levelHeroSymbol: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  levelHeroSymbolText: { color: colors.accent, fontSize: 38, fontWeight: '900' },
  levelHeaderCopy: { flex: 1, gap: spacing.xs },
  levelList: { gap: spacing.md },
  levelCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  levelCardLocked: { borderColor: colors.border, opacity: 0.62 },
  levelNumber: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
  },
  levelNumberAvailable: { borderColor: colors.accent, backgroundColor: colors.accent },
  levelNumberText: { color: colors.textMuted, fontSize: 20, fontWeight: '900' },
  levelNumberTextAvailable: { color: colors.background },
  levelCopy: { flex: 1, gap: spacing.xs },
  levelTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  levelTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  levelStatusAvailable: { color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 0.8 },
  levelStatusLocked: { color: colors.textMuted, fontSize: 12, fontWeight: '900', letterSpacing: 0.8 },
  levelMode: { color: colors.accent, fontSize: 14, fontWeight: '800' },
  levelDescription: { color: colors.textMuted, fontSize: 15, lineHeight: 21 },
  levelHint: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceElevated,
  },
  levelHintText: { color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center' },
});
