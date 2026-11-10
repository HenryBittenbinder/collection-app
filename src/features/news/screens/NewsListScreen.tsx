import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { useNews } from '@/src/features/news/api/newsHooks';
import NewsCard from '@/src/features/news/components/NewsCard';
import BackButton from '@/src/shared/components/BackButton';
import EmptyState from '@/src/shared/components/EmptyState';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function NewsListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const query = useNews();
  const news = query.data ?? [];

  if (query.isLoading) {
    return <View style={styles.screen}><View style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}><BackButton /><Text style={styles.heading}>Novidades</Text></View><LoadingState message="Carregando notícias..." /></View>;
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}>
        <BackButton />
        <Text style={styles.heading}>Novidades</Text>
      </View>
      <FlatList
        data={news}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, news.length === 0 && styles.emptyContent]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => { void query.refetch(); }} tintColor={theme.colors.primary} colors={[theme.colors.primary]} />}
        ListEmptyComponent={query.isError
          ? <ErrorState message={getApiError(query.error).message} onRetry={() => { void query.refetch(); }} />
          : <EmptyState message="Nenhuma notícia disponível no momento." />}
        ListFooterComponent={<Text style={styles.disclaimer}>Conteúdo de exemplo</Text>}
        renderItem={({ item }) => <NewsCard news={item} onPress={() => router.push({ pathname: '/noticias/[id]', params: { id: String(item.id) } })} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md },
  heading: { color: theme.colors.text, fontSize: 23, fontWeight: '800' },
  listContent: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.sm, paddingBottom: 130 },
  emptyContent: { flexGrow: 1 },
  disclaimer: { color: theme.colors.textMuted, fontSize: 11, textAlign: 'center', paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.xl },
});
