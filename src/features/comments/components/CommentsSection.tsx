import { StyleSheet, Text, View } from 'react-native';

import CommentRow from '@/src/features/comments/components/CommentRow';
import { useComments } from '@/src/features/comments/api/commentsHooks';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { getApiError } from '@/src/shared/lib/getApiError';
import theme from '@/src/shared/theme/theme';

export default function CommentsSection({ itemId }: { itemId: number }) {
  const { data: comments = [], isLoading, isError, error, refetch } = useComments(itemId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentários</Text>
      {isLoading ? <LoadingState message="Carregando comentários..." /> : isError ? <ErrorState message={getApiError(error).message} onRetry={() => { void refetch(); }} /> : comments.length === 0 ? <Text style={styles.empty}>Seja o primeiro a comentar.</Text> : comments.map((comment) => <CommentRow key={comment.id} comment={comment} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: theme.spacing.lg, marginTop: theme.spacing.xl },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: '700', marginBottom: theme.spacing.sm },
  empty: { color: theme.colors.textSecondary, paddingVertical: theme.spacing.md },
});
