import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getConversations, getMessages, sendMessage, startConversation } from './chatApi';
import type { Conversation } from '@/src/features/chat/types/chat';

export const chatQueryKeys = {
  conversations: ['conversations'] as const,
  messages: (conversationId: number) => ['conversationMessages', conversationId] as const,
};

export function useConversations() {
  return useQuery({ queryKey: chatQueryKeys.conversations, queryFn: getConversations });
}

export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: chatQueryKeys.messages(conversationId),
    queryFn: () => getMessages(conversationId),
    enabled: Number.isFinite(conversationId) && conversationId > 0,
    refetchInterval: 5000,
  });
}

export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => sendMessage(conversationId, body),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.messages(conversationId) }),
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations }),
    ]),
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => startConversation(itemId),
    onSuccess: (conversation: Conversation) => {
      queryClient.setQueryData<Conversation[]>(chatQueryKeys.conversations, (current = []) => [
        conversation,
        ...current.filter((entry) => entry.id !== conversation.id),
      ]);
      return queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations });
    },
  });
}
