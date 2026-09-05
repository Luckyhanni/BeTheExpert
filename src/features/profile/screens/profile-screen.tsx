import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { Card } from '@/components/ui/card';
import { dashboard } from '@/features/home/data/mock-dashboard';
import { colors, radii, spacing } from '@/theme/tokens';

const categories = [
  { label: 'Transfers', value: 84 },
  { label: 'Spieler', value: 76 },
  { label: 'Vereine', value: 73 },
  { label: 'Aufstellungen', value: 67 },
  { label: 'Geschichte', value: 51 },
];

export function ProfileScreen() {
  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>F</Text>
        </View>
        <View>
          <Text style={styles.eyebrow}>EXPERTENPROFIL</Text>
          <Text style={styles.title}>{dashboard.displayName}</Text>
          <Text style={styles.subtitle}>
            {dashboard.careerTitle} · Level {dashboard.level}
          </Text>
        </View>
      </View>

      <Card>
        <Text style={styles.label}>Overall Expert Rating</Text>
        <Text style={styles.rating}>{dashboard.expertRating}</Text>
        <Text style={styles.muted}>
          Getrennt von Karriere-XP – hier zählt deine tatsächliche Spielstärke.
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Fachgebiete</Text>
        {categories.map((category) => (
          <View key={category.label} style={styles.category}>
            <View style={styles.rowBetween}>
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <Text style={styles.categoryValue}>{category.value}</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${category.value}%` }]} />
            </View>
          </View>
        ))}
      </Card>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.md },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.background, fontSize: 31, fontWeight: '900' },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: 14 },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  rating: { color: colors.accent, fontSize: 48, fontWeight: '900' },
  muted: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  category: { gap: spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryLabel: { color: colors.text, fontSize: 15, fontWeight: '700' },
  categoryValue: { color: colors.text, fontSize: 15, fontWeight: '900' },
  track: { height: 9, backgroundColor: colors.background, borderRadius: radii.pill, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accentStrong, borderRadius: radii.pill },
});
