import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { News } from '@/src/features/news/types/news';
import theme from '@/src/shared/theme/theme';

type NewsCardProps = { news: News; onPress: () => void };

export function formatNewsDate(dateValue: string): string {
  const timestamp = new Date(dateValue).getTime();
  if (Number.isNaN(timestamp)) return '';
  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
  if (days === 0) return 'hoje';
  if (days === 1) return 'há 1 dia';
  return `há ${days} dias`;
}

export default function NewsCard({ news, onPress }: NewsCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: news.image }} accessibilityLabel={news.title} style={styles.image} />
        <View style={styles.categoryChip}><Text numberOfLines={1} style={styles.categoryText}>{news.category}</Text></View>
      </View>
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>{news.title}</Text>
        <Text numberOfLines={3} style={styles.summary}>{news.summary}</Text>
        <View style={styles.footer}>
          <Text numberOfLines={1} style={styles.publisher}>{news.publisher}</Text>
          <Text style={styles.date}>{formatNewsDate(news.published_at)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden', marginBottom: theme.spacing.lg, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, ...theme.shadows.button },
  imageContainer: { width: '100%', aspectRatio: 16 / 9, backgroundColor: theme.colors.surfaceAlt },
  image: { width: '100%', height: '100%' },
  categoryChip: { position: 'absolute', top: theme.spacing.md, left: theme.spacing.md, maxWidth: '80%', paddingHorizontal: theme.spacing.md, paddingVertical: 6, backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill },
  categoryText: { color: '#211707', fontSize: 11, fontWeight: '800' },
  content: { padding: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: 17, lineHeight: 23, fontWeight: '800' },
  summary: { color: theme.colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: theme.spacing.xs },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm, marginTop: theme.spacing.md },
  publisher: { flex: 1, color: theme.colors.textMuted, fontSize: 11, fontWeight: '600' },
  date: { color: theme.colors.textMuted, fontSize: 11 },
});
