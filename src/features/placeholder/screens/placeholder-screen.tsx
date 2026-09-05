import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { colors, radii, spacing } from '@/theme/tokens';

type PlaceholderScreenProps = {
  title: string;
  description: string;
  symbol: string;
};

export function PlaceholderScreen({ title, description, symbol }: PlaceholderScreenProps) {
  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.symbolBox}>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>IN VORBEREITUNG</Text>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 520,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  symbolBox: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  symbol: { color: colors.accent, fontSize: 46 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900' },
  description: {
    maxWidth: 420,
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
  },
  badge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceElevated,
  },
  badgeText: { color: colors.accent, fontSize: 14, fontWeight: '900', letterSpacing: 1 },
});
