import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAccountSummary } from '@/features/auth/use-account-summary';
import { colors, radii, spacing } from '@/theme/tokens';

const quickGames = [
  { title: 'Transfers', symbol: '⇄', colors: ['#0A4B38', '#0B201A'] as const },
  { title: 'Startelf', symbol: '↗', colors: ['#123E72', '#0B1E36'] as const },
  { title: 'Higher / Lower', symbol: '⇅', colors: ['#69451D', '#25180E'] as const },
  { title: 'Grid', symbol: '▦', colors: ['#573078', '#241330'] as const },
];

export function HomeScreen() {
  const router = useRouter();
  const summary = useAccountSummary();
  const xpProgress = `${Math.min(100, summary.passed / 32 * 100)}%` as const;

  return (
    <AppScreen>
      <View style={styles.wordmarkRow}>
        <Text style={styles.wordmark}>
          BE THE <Text style={styles.wordmarkAccent}>EXPERT</Text>
        </Text>
        <View style={styles.notification}>
          <Text style={styles.notificationIcon}>●</Text>
        </View>
      </View>

      <View style={styles.profileRow}>
        <View style={styles.avatarRing}>
          <Image
            accessibilityLabel="Be the Expert Moderator"
            resizeMode="cover"
            source={require('../../../../assets/branding/app-icon.png')}
            style={styles.avatar}
          />
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.greeting}>Hallo {summary.name || 'Experte'}</Text>
          <Text style={styles.careerLine}>
            {summary.loading ? 'Karriere wird geladen …' : summary.error ? 'Fortschritt derzeit nicht verfügbar' : `${summary.passed} von 32 Karriere-Leveln bestanden`}
          </Text>
          <View style={styles.xpRow}>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: xpProgress }]} />
            </View>
            <Text style={styles.xpValue}>{summary.passed} / 32</Text>
          </View>
        </View>
      </View>

      <LinearGradient
        colors={['#183725', '#0B1913', '#08110E']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.dailyCard}>
        <View style={styles.dailyGlow} />
        <View style={styles.dailyTopRow}>
          <View style={styles.dailyCopy}>
            <Text style={styles.sectionLabel}>KARRIERE STARTEN</Text>
            <Text style={styles.dailyTitle}>Deutsche Meister</Text>
          </View>
          <Text style={styles.trophy}>🏆</Text>
        </View>
        <Text style={styles.dailyDescription}>
          Erkenne deutsche Meister und starte deine Karriere.
        </Text>
        <Text style={styles.rewardLine}>MEISTER · MULTIPLE CHOICE</Text>
        <View style={styles.buttonWrap}>
          <PrimaryButton label="Jetzt spielen  →" onPress={() => router.push('/career')} />
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Schnell starten</Text>
        <Text style={styles.sectionAction}>Alle Spiele →</Text>
      </View>

      <View style={styles.quickGrid}>
        {quickGames.map((game) => (
          <Pressable
            accessibilityRole="button"
            key={game.title}
            onPress={() => router.push('/career')}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}>
            <LinearGradient colors={game.colors} style={styles.quickGradient}>
              <Text style={styles.quickSymbol}>{game.symbol}</Text>
              <Text style={styles.quickTitle}>{game.title}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Dein Fortschritt</Text>
          <Text style={styles.progressArrow}>›</Text>
        </View>
        <View style={styles.rankRow}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankIcon}>★</Text>
          </View>
          <View style={styles.rankCopy}>
            <Text style={styles.rankName}>Deine Fußballkarriere</Text>
            <Text style={styles.rankGoal}>Vier Themen · Zwei Ligen · Dein Fortschritt</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: xpProgress }]} />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  wordmark: {
    color: colors.text,
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  wordmarkAccent: { color: colors.accent },
  notification: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  notificationIcon: { color: colors.accent, fontSize: 18 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatarRing: {
    width: 92,
    height: 92,
    padding: 3,
    borderRadius: 46,
    backgroundColor: colors.accent,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 43 },
  profileCopy: { flex: 1, gap: spacing.sm },
  greeting: { color: colors.text, fontSize: 27, fontWeight: '900', letterSpacing: -0.5 },
  careerLine: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
  xpRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  xpTrack: {
    flex: 1,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', borderRadius: radii.pill, backgroundColor: colors.accent },
  xpValue: { color: colors.text, fontSize: 15, fontWeight: '800' },
  dailyCard: {
    minHeight: 310,
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#315342',
    padding: spacing.lg,
  },
  dailyGlow: {
    position: 'absolute',
    right: -50,
    top: -50,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#335D24',
    opacity: 0.3,
  },
  dailyTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  dailyCopy: { flex: 1, gap: spacing.sm },
  sectionLabel: { color: colors.accent, fontSize: 15, fontWeight: '900', letterSpacing: 1.5 },
  dailyTitle: { color: colors.text, fontSize: 30, fontWeight: '900', lineHeight: 36 },
  trophy: { fontSize: 62, marginLeft: spacing.sm },
  dailyDescription: { color: colors.text, fontSize: 17, lineHeight: 25, maxWidth: 420 },
  rewardLine: { color: colors.accent, fontSize: 16, fontWeight: '900', letterSpacing: 0.8 },
  buttonWrap: { maxWidth: 260 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  sectionAction: { color: colors.textMuted, fontSize: 15, fontWeight: '700' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickCard: { width: '47.5%', minHeight: 138, borderRadius: radii.md, overflow: 'hidden' },
  quickGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#315342',
    padding: spacing.md,
  },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
  quickSymbol: { color: colors.accent, fontSize: 47, fontWeight: '500', lineHeight: 50 },
  quickTitle: { color: colors.text, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  progressCard: {
    gap: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  progressArrow: { color: colors.textMuted, fontSize: 34, lineHeight: 34 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rankBadge: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.accent,
    backgroundColor: colors.surfaceElevated,
  },
  rankIcon: { color: colors.accent, fontSize: 30 },
  rankCopy: { flex: 1, gap: spacing.xs },
  rankName: { color: colors.text, fontSize: 19, fontWeight: '900' },
  rankGoal: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
  progressTrack: {
    height: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radii.pill, backgroundColor: colors.accent },
});
