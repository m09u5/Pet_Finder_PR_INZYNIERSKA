import type { PublicConversation, PublicMessage } from "@pet-finder/shared";

export interface ConversationThreadProps {
  conversationId: string;
}

export interface MessagesResponse {
  messages: PublicMessage[];
  conversation: PublicConversation;
}

export interface ChatSocketEvent {
  type: string;
  message?: PublicMessage;
}
