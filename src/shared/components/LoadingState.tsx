import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import theme from '@/src/shared/theme/theme';

export default function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md, backgroundColor: theme.colors.background },
  message: { color: theme.colors.textSecondary, fontSize: 14 },
});
