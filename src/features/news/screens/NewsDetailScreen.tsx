import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useNewsItem } from '@/src/features/news/api/newsHooks';
import { formatNewsDate } from '@/src/features/news/components/NewsCard';
import BackButton from '@/src/shared/components/BackButton';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function NewsDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(rawId);
  const insets = useSafeAreaInsets();
  const query = useNewsItem(id);

  if (query.isLoading) return <View style={styles.screen}><LoadingState message="Carregando notícia..." /></View>;
  if (query.isError || !query.data) {
    return <View style={styles.screen}><View style={[styles.backHeader, { paddingTop: insets.top + theme.spacing.sm }]}><BackButton /></View><ErrorState message={getApiError(query.error).message} onRetry={() => { void query.refetch(); }} /></View>;
  }

  const news = query.data;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Image source={{ uri: news.image }} accessibilityLabel={news.title} style={styles.image} />
          <View style={[styles.backOverlay, { top: insets.top + theme.spacing.sm }]}><BackButton /></View>
        </View>
        <View style={styles.content}>
          <View style={styles.categoryChip}><Text style={styles.categoryText}>{news.category}</Text></View>
          <Text style={styles.title}>{news.title}</Text>
          <View style={styles.meta}><Text style={styles.publisher}>{news.publisher}</Text><Text style={styles.date}>{formatNewsDate(news.published_at)}</Text></View>
          <Text style={styles.body}>{news.body}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 110 },
  hero: { width: '100%', aspectRatio: 16 / 10, backgroundColor: theme.colors.surfaceAlt },
  image: { width: '100%', height: '100%' },
  backOverlay: { position: 'absolute', left: theme.spacing.lg },
  backHeader: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.sm },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg },
  categoryChip: { alignSelf: 'flex-start', paddingHorizontal: theme.spacing.md, paddingVertical: 6, borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary, marginBottom: theme.spacing.md },
  categoryText: { color: '#211707', fontSize: 11, fontWeight: '800' },
  title: { color: theme.colors.text, fontSize: 27, lineHeight: 34, fontWeight: '800' },
  meta: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md, marginTop: theme.spacing.md, marginBottom: theme.spacing.xl },
  publisher: { flex: 1, color: theme.colors.textSecondary, fontSize: 13, fontWeight: '600' },
  date: { color: theme.colors.textMuted, fontSize: 12 },
  body: { color: theme.colors.textSecondary, fontSize: 16, lineHeight: 27 },
});
