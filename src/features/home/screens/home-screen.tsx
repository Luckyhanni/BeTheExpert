import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { dashboard } from '@/features/home/data/mock-dashboard';
import { colors, radii, spacing } from '@/theme/tokens';

export function HomeScreen() {
  const router = useRouter();
  const xpProgress = `${Math.round((dashboard.xp / dashboard.nextLevelXp) * 100)}%` as const;
  const dailyProgress = `${Math.round(
    (dashboard.dailyCompleted / dashboard.dailyTotal) * 100,
  )}%` as const;

  return (
    <AppScreen>
      <View style={styles.header}>
        <Image
          accessibilityLabel="Be the Expert Logo"
          contentFit="cover"
          source={require('../../../../assets/branding/app-icon.png')}
          style={styles.logo}
        />
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>BE THE EXPERT</Text>
          <Text style={styles.greeting}>Guten Tag, {dashboard.displayName}.</Text>
          <Text style={styles.subtitle}>Learn it. Play it. Master it.</Text>
        </View>
      </View>

      <Card style={styles.careerCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>Deine Karriere</Text>
            <Text style={styles.cardTitle}>{dashboard.careerTitle}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelSmall}>LEVEL</Text>
            <Text style={styles.levelNumber}>{dashboard.level}</Text>
          </View>
        </View>
        <View>
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>{dashboard.xp.toLocaleString('de-DE')} XP</Text>
            <Text style={styles.muted}>{dashboard.nextLevelXp.toLocaleString('de-DE')} XP</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: xpProgress }]} />
          </View>
        </View>
        <PrimaryButton label="Karriere fortsetzen" onPress={() => router.push('/play')} />
      </Card>

      <View style={styles.twoColumns}>
        <Card style={styles.compactCard}>
          <Text style={styles.label}>Expertenwertung</Text>
          <Text style={styles.rating}>{dashboard.expertRating}</Text>
          <Text style={styles.muted}>Top 18 % der Reporter</Text>
        </Card>
        <Card style={styles.compactCard}>
          <Text style={styles.label}>Tagesserie</Text>
          <Text style={styles.rating}>7</Text>
          <Text style={styles.muted}>Tage in Folge</Text>
        </Card>
      </View>

      <Card>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>Daily Challenge</Text>
            <Text style={styles.cardTitle}>Redaktionsschluss</Text>
          </View>
          <Text style={styles.dailyCount}>
            {dashboard.dailyCompleted}/{dashboard.dailyTotal}
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: dailyProgress }]} />
        </View>
        <Text style={styles.muted}>Noch zwei Aufgaben bis zum Tagesbonus.</Text>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deine Stärken</Text>
        {dashboard.strengths.map((strength) => (
          <View key={strength.label} style={styles.skillRow}>
            <Text style={styles.skillLabel}>{strength.label}</Text>
            <View style={styles.skillTrack}>
              <View style={[styles.skillFill, { width: `${strength.value}%` }]} />
            </View>
            <Text style={styles.skillValue}>{strength.value}</Text>
          </View>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.md },
  logo: { width: 76, height: 76, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border },
  headerCopy: { flex: 1, gap: spacing.xs },
  eyebrow: { color: colors.accent, fontSize: 13, fontWeight: '900', letterSpacing: 2.2 },
  greeting: { color: colors.text, fontSize: 25, fontWeight: '900', letterSpacing: -0.6 },
  subtitle: { color: colors.textMuted, fontSize: 15 },
  careerCard: { backgroundColor: colors.surfaceElevated },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  cardTitle: { color: colors.text, fontSize: 21, fontWeight: '800', marginTop: spacing.xs },
  levelBadge: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  levelSmall: { color: colors.background, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  levelNumber: { color: colors.background, fontSize: 27, fontWeight: '900', lineHeight: 29 },
  muted: { color: colors.textMuted, fontSize: 13 },
  track: { height: 8, borderRadius: radii.pill, backgroundColor: colors.background, overflow: 'hidden', marginTop: spacing.sm },
  fill: { height: '100%', borderRadius: radii.pill, backgroundColor: colors.accent },
  twoColumns: { flexDirection: 'row', gap: spacing.md },
  compactCard: { flex: 1, minWidth: 0 },
  rating: { color: colors.text, fontSize: 32, fontWeight: '900' },
  dailyCount: { color: colors.accent, fontSize: 20, fontWeight: '900' },
  section: { gap: spacing.md },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  skillRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  skillLabel: { width: 82, color: colors.text, fontSize: 14, fontWeight: '700' },
  skillTrack: { flex: 1, height: 8, borderRadius: radii.pill, backgroundColor: colors.surface, overflow: 'hidden' },
  skillFill: { height: '100%', backgroundColor: colors.accentStrong, borderRadius: radii.pill },
  skillValue: { width: 28, color: colors.text, textAlign: 'right', fontWeight: '800' },
});
