import { StyleSheet, Text, View } from 'react-native';

import theme from '@/src/shared/theme/theme';
import Button from '@/src/shared/components/Button';

type ErrorStateProps = { message: string; onRetry: () => void };

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Button title="Tentar novamente" onPress={onRetry} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 180, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  message: { color: theme.colors.danger, fontSize: 14, textAlign: 'center', marginBottom: theme.spacing.md },
  button: { alignSelf: 'center', minWidth: 180 },
});
