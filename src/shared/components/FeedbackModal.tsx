import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, View } from 'react-native';

import theme from '@/src/shared/theme/theme';
import Button from '@/src/shared/components/Button';

type FeedbackModalProps = {
  visible: boolean;
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
};

export default function FeedbackModal({ visible, title, message, actionLabel, onAction }: FeedbackModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onAction}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={34} color="#211707" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Button title={actionLabel} onPress={onAction} style={styles.button} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.72)', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  card: { width: '100%', maxWidth: 380, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.xl, padding: theme.spacing.xl, alignItems: 'center' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.lg },
  title: { color: theme.colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: theme.spacing.sm },
  message: { color: theme.colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: theme.spacing.lg },
  button: { alignSelf: 'stretch' },
});
