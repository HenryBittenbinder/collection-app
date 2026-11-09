import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import theme from '@/src/shared/theme/theme';

export default function EmptyState({ message = 'Nenhum item cadastrado ainda' }: { message?: string }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="archive-outline" size={42} color={theme.colors.textMuted} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 180, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  message: { color: theme.colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: theme.spacing.md },
});
