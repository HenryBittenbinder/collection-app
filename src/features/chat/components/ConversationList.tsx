import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { useConversations } from '@/src/features/chat/api/chatHooks';
import ConversationListItem from '@/src/features/chat/components/ConversationListItem';
import EmptyState from '@/src/shared/components/EmptyState';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function ConversationList() {
  const router = useRouter();
  const query = useConversations();
  const conversations = query.data ?? [];

  if (query.isLoading) return <LoadingState message="Carregando conversas..." />;
  if (query.isError && !query.data) return <ErrorState message={getApiError(query.error).message} onRetry={() => { void query.refetch(); }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(conversation) => String(conversation.id)}
        contentContainerStyle={[styles.list, conversations.length === 0 && styles.emptyList]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => { void query.refetch(); }} tintColor={theme.colors.primary} colors={[theme.colors.primary]} />}
        ListEmptyComponent={<EmptyState message="Nenhuma conversa ainda" />}
        renderItem={({ item }) => <ConversationListItem conversation={item} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: String(item.id) } })} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl },
  emptyList: { flexGrow: 1 },
});
