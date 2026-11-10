import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Conversation } from '@/src/features/chat/types/chat';
import theme from '@/src/shared/theme/theme';

export default function ConversationListItem({ conversation, onPress }: { conversation: Conversation; onPress: () => void }) {
  const lastMessage = conversation.last_message;

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      {conversation.other_user.avatar ? (
        <Image source={{ uri: conversation.other_user.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}><Text style={styles.initial}>{conversation.other_user.name.charAt(0).toUpperCase()}</Text></View>
      )}
      <View style={styles.content}>
        <View style={styles.userLine}>
          <Text style={styles.name} numberOfLines={1}>{conversation.other_user.name}</Text>
          <Text style={styles.time}>{lastMessage ? formatTime(lastMessage.created_at) : ''}</Text>
        </View>
        <Text style={styles.username} numberOfLines={1}>@{conversation.other_user.username}</Text>
        {conversation.item ? <Text style={styles.item} numberOfLines={1}><Ionicons name="pricetag-outline" size={12} color={theme.colors.primarySoft} /> {conversation.item.name}</Text> : null}
        <Text style={styles.preview} numberOfLines={1}>{lastMessage?.body ?? 'Nenhuma mensagem ainda'}</Text>
      </View>
    </Pressable>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: theme.spacing.md },
  avatarFallback: { backgroundColor: theme.colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  initial: { color: theme.colors.text, fontSize: 20, fontWeight: '700' },
  content: { flex: 1 },
  userLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: theme.colors.text, fontSize: 15, fontWeight: '700', flex: 1, marginRight: theme.spacing.sm },
  time: { color: theme.colors.textMuted, fontSize: 11 },
  username: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  item: { color: theme.colors.primarySoft, fontSize: 12, marginTop: theme.spacing.xs },
  preview: { color: theme.colors.textSecondary, fontSize: 12, marginTop: theme.spacing.xs },
});
