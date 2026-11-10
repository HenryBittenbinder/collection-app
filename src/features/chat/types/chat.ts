export interface ChatUser {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
}

export interface ConversationItem {
  id: number;
  name: string;
  photo: string | null;
}

export interface ConversationLastMessage {
  body: string;
  created_at: string;
  sent_by_me: boolean;
}

export interface Conversation {
  id: number;
  other_user: ChatUser;
  item: ConversationItem | null;
  last_message: ConversationLastMessage | null;
  messages_count: number;
}

export interface ChatMessage {
  id: number;
  body: string;
  created_at: string;
  sent_by_me: boolean;
  sender: ChatUser;
}
