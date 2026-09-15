import type { Message } from "@prisma/client";
import type { PublicMessage } from "@pet-finder/shared";

export function toPublicMessage(message: Message): PublicMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    readAt: message.readAt ? message.readAt.toISOString() : null,
  };
}
