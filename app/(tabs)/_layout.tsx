import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '@/src/shared/theme/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const icon = (name: keyof typeof Ionicons.glyphMap, focused: boolean, size: number) => (
    <View style={[styles.iconPill, focused && styles.iconPillActive]}>
      <Ionicons name={name} color={focused ? theme.colors.primary : theme.colors.textMuted} size={size} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: [styles.tabBar, { bottom: Math.max(insets.bottom, 8) + 8 }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        sceneStyle: { paddingBottom: 94 },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { color: theme.colors.text, fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Explorar', headerTitle: 'Explorar', tabBarIcon: ({ focused, size }) => icon(focused ? 'compass' : 'compass-outline', focused, size) }} />
      <Tabs.Screen name="search" options={{ title: 'Pesquisa', headerTitle: 'Pesquisa', tabBarIcon: ({ focused, size }) => icon(focused ? 'search' : 'search-outline', focused, size) }} />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Adicionar',
          headerTitle: 'Adicionar',
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} style={styles.addGradient}>
                <Ionicons name="add" size={29} color="#211707" />
              </LinearGradient>
            </View>
          ),
        }}
      />
      <Tabs.Screen name="activity" options={{ title: 'Atividade', headerTitle: 'Atividade', tabBarIcon: ({ focused, size }) => icon(focused ? 'notifications' : 'notifications-outline', focused, size) }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', headerTitle: 'Perfil', tabBarIcon: ({ focused, size }) => icon(focused ? 'person' : 'person-outline', focused, size) }} />
    </Tabs>
  );
}

const styles = {
  tabBar: {
    position: 'absolute' as const,
    left: 16,
    right: 16,
    height: 68,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: theme.colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: '#30343E',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#090A0D',
    borderRadius: theme.radius.xl,
    ...theme.shadows.floating,
  },
  tabLabel: { fontSize: 10, fontWeight: '700' as const, marginTop: 1 },
  tabItem: { paddingTop: 1 },
  iconPill: { minWidth: 40, height: 30, borderRadius: theme.radius.pill, alignItems: 'center' as const, justifyContent: 'center' as const },
  iconPillActive: { backgroundColor: 'rgba(232,176,75,0.14)' },
  addButton: { width: 54, height: 54, borderRadius: 27, marginTop: -23, borderWidth: 1, borderColor: '#F3CF81', borderBottomColor: '#8C611E', overflow: 'hidden' as const, ...theme.shadows.button },
  addGradient: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const },
};
