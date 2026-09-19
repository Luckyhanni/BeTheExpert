import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, type ColorValue } from 'react-native';

import { colors } from '@/theme/tokens';
import { AuthProvider } from '@/features/auth/auth-provider';

function TabIcon({ label, color }: { label: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 18, fontWeight: '900' }}>{label}</Text>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { fontSize: 13, fontWeight: '700' },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 76,
            paddingBottom: 10,
            paddingTop: 8,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Start',
            tabBarIcon: ({ color }) => <TabIcon color={color} label="⌂" />,
          }}
        />
        <Tabs.Screen
          name="play"
          options={{
            title: 'Spielen',
            tabBarIcon: ({ color }) => <TabIcon color={color} label="▶" />,
          }}
        />
        <Tabs.Screen
          name="career"
          options={{
            title: 'Karriere',
            tabBarIcon: ({ color }) => <TabIcon color={color} label="▥" />,
          }}
        />
        <Tabs.Screen
          name="battle"
          options={{
            title: 'Battle',
            tabBarIcon: ({ color }) => <TabIcon color={color} label="⚔" />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <TabIcon color={color} label="○" />,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
