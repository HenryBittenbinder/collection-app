import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createComment, getComments } from './commentsApi';
import type { CommentFormValues } from '@/src/features/comments/schemas/commentSchema';

export const commentQueryKeys = {
  list: (itemId: number) => ['comments', itemId] as const,
};

export function useComments(itemId: number) {
  return useQuery({ queryKey: commentQueryKeys.list(itemId), queryFn: () => getComments(itemId), enabled: Number.isFinite(itemId) });
}

export function useCreateComment(itemId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CommentFormValues) => createComment(itemId, values),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(itemId) }),
      queryClient.invalidateQueries({ queryKey: ['items'] }),
    ]),
  });
}
