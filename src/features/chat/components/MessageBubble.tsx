import { StyleSheet, Text, View } from 'react-native';

import type { ChatMessage } from '@/src/features/chat/types/chat';
import theme from '@/src/shared/theme/theme';

export default function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={[styles.row, message.sent_by_me ? styles.myRow : styles.theirRow]}>
      <View style={[styles.bubble, message.sent_by_me ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.body, message.sent_by_me && styles.myBody]}>{message.body}</Text>
        <Text style={[styles.time, message.sent_by_me && styles.myTime]}>{formatTime(message.created_at)}</Text>
      </View>
    </View>
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  row: { width: '100%', flexDirection: 'row', marginBottom: theme.spacing.sm },
  myRow: { justifyContent: 'flex-end' },
  theirRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '84%', borderRadius: theme.radius.lg, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  myBubble: { backgroundColor: theme.colors.primary, borderBottomRightRadius: theme.radius.sm },
  theirBubble: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderBottomLeftRadius: theme.radius.sm },
  body: { color: theme.colors.text, fontSize: 14, lineHeight: 20 },
  myBody: { color: '#081018' },
  time: { alignSelf: 'flex-end', color: theme.colors.textMuted, fontSize: 10, marginTop: theme.spacing.xs },
  myTime: { color: '#26365D' },
});
