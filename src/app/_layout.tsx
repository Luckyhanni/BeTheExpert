import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, type ColorValue } from 'react-native';

import { colors } from '@/theme/tokens';

function TabIcon({ label, color }: { label: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 18, fontWeight: '900' }}>{label}</Text>;
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 68,
            paddingBottom: 8,
            paddingTop: 6,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Start',
            tabBarIcon: ({ color }) => <TabIcon color={color} label="B" />,
          }}
        />
        <Tabs.Screen
          name="play"
          options={{
            title: 'Spielen',
            tabBarIcon: ({ color }) => <TabIcon color={color} label="?" />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <TabIcon color={color} label="★" />,
          }}
        />
      </Tabs>
    </>
  );
}
