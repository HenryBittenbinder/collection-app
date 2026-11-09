import { Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '@/src/shared/theme/theme';

type ErrorStateProps = { message: string; onRetry: () => void };

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 180, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  message: { color: theme.colors.danger, fontSize: 14, textAlign: 'center', marginBottom: theme.spacing.md },
  button: { backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, borderRadius: theme.radius.md },
  buttonText: { color: '#081018', fontWeight: '700' },
});
