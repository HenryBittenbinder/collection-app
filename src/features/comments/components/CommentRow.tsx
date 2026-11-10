import { Image, StyleSheet, Text, View } from 'react-native';

import type { Comment } from '@/src/features/comments/types/comment';
import theme from '@/src/shared/theme/theme';

export default function CommentRow({ comment }: { comment: Comment }) {
  return (
    <View style={styles.row}>
      {comment.author.avatar ? <Image source={{ uri: comment.author.avatar }} style={styles.avatar} /> : <View style={[styles.avatar, styles.fallback]}><Text style={styles.initial}>{comment.author.name.charAt(0).toUpperCase()}</Text></View>}
      <View style={styles.content}>
        <View style={styles.header}><Text style={styles.name}>{comment.author.name}</Text><Text style={styles.username}>@{comment.author.username}</Text></View>
        <Text style={styles.body}>{comment.body}</Text>
        <Text style={styles.date}>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  avatar: { width: 38, height: 38, borderRadius: 19, marginRight: theme.spacing.md },
  fallback: { backgroundColor: theme.colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  initial: { color: theme.colors.text, fontWeight: '700' },
  content: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: theme.spacing.xs },
  name: { color: theme.colors.text, fontWeight: '700', marginRight: theme.spacing.sm },
  username: { color: theme.colors.textSecondary, fontSize: 12 },
  body: { color: theme.colors.text, fontSize: 14, lineHeight: 21 },
  date: { color: theme.colors.textMuted, fontSize: 11, marginTop: theme.spacing.xs },
});
