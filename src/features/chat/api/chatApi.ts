import api from '@/src/shared/lib/api';
import type { ChatMessage, Conversation } from '@/src/features/chat/types/chat';

type ConversationsResponse = { data: Conversation[] };
type ConversationResponse = { data: Conversation };
type MessagesResponse = { data: ChatMessage[] };
type MessageResponse = { data: ChatMessage };

export async function getConversations(): Promise<Conversation[]> {
  const response = await api.get<ConversationsResponse>('/conversations');
  return response.data.data;
}

export async function startConversation(itemId: number): Promise<Conversation> {
  const response = await api.post<ConversationResponse>('/conversations', { item_id: itemId });
  return response.data.data;
}

export async function getMessages(conversationId: number): Promise<ChatMessage[]> {
  const response = await api.get<MessagesResponse>(`/conversations/${conversationId}/messages`);
  return response.data.data;
}

export async function sendMessage(conversationId: number, body: string): Promise<ChatMessage> {
  const response = await api.post<MessageResponse>(`/conversations/${conversationId}/messages`, { body });
  return response.data.data;
}
