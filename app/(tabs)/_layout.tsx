import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import theme from '@/src/shared/theme/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 74,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text,
          fontWeight: '700',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          headerTitle: 'Explorar',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="compass"
              color={String(focused ? theme.colors.primary : color ?? theme.colors.textMuted)}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Pesquisa',
          headerTitle: 'Pesquisa',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="search"
              color={String(focused ? theme.colors.primary : color ?? theme.colors.textMuted)}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Adicionar',
          headerTitle: 'Adicionar',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="add-circle"
              color={String(focused ? theme.colors.primary : color ?? theme.colors.textMuted)}
              size={size + 4}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Atividade',
          headerTitle: 'Atividade',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="notifications"
              color={String(focused ? theme.colors.primary : color ?? theme.colors.textMuted)}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="person"
              color={String(focused ? theme.colors.primary : color ?? theme.colors.textMuted)}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
