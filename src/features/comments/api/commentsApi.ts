import api from '@/src/shared/lib/api';
import type { Comment } from '@/src/features/comments/types/comment';
import type { CommentFormValues } from '@/src/features/comments/schemas/commentSchema';

type CommentsResponse = { data: Comment[] };
type CommentResponse = { data: Comment };

export async function getComments(itemId: number): Promise<Comment[]> {
  const response = await api.get<CommentsResponse>(`/items/${itemId}/comments`);
  return response.data.data;
}

export async function createComment(itemId: number, values: CommentFormValues): Promise<Comment> {
  const response = await api.post<CommentResponse>(`/items/${itemId}/comments`, values);
  return response.data.data;
}
