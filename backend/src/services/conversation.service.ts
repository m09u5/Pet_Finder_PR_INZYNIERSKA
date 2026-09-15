import type { CreateConversationInput, ListMessagesQuery, SendMessageInput, UserRole } from "@pet-finder/shared";
import { offerRepository } from "../repositories/offer.repository";
import { conversationRepository } from "../repositories/conversation.repository";
import { ForbiddenError, NotFoundError } from "../utils/AppError";
import { toPublicMessage } from "../utils/publicMessage";
import { pushMessageToUsers } from "../websocket/chat.ws";

function assertParticipant(conversation: { customerId: string; breederId: string }, userId: string) {
  if (conversation.customerId !== userId && conversation.breederId !== userId) {
    throw new ForbiddenError("Brak dostępu do tej rozmowy", "NOT_PARTICIPANT");
  }
}

export async function startConversation(customerId: string, input: CreateConversationInput) {
  const offer = await offerRepository.findById(input.offerId);
  if (!offer || offer.status !== "ACTIVE") {
    throw new NotFoundError("Ogłoszenie nie istnieje");
  }

  const existing = await conversationRepository.findByOfferAndCustomer(input.offerId, customerId);
  if (existing) {
    return existing;
  }

  return conversationRepository.create(input.offerId, customerId, offer.breeder.userId);
}

export function listMyConversations(userId: string, role: UserRole) {
  return role === "BREEDER" ? conversationRepository.listForBreeder(userId) : conversationRepository.listForCustomer(userId);
}

export async function getConversation(conversationId: string, userId: string) {
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) {
    throw new NotFoundError("Rozmowa nie istnieje");
  }
  assertParticipant(conversation, userId);
  return conversation;
}

export async function listMessages(conversationId: string, userId: string, query: ListMessagesQuery) {
  const conversation = await getConversation(conversationId, userId);
  await conversationRepository.markMessagesRead(conversationId, userId);

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    conversationRepository.listMessages(conversationId, { skip, take: query.limit }),
    conversationRepository.countMessages(conversationId),
  ]);

  return { items, total, page: query.page, limit: query.limit, conversation };
}

export async function sendMessage(conversationId: string, senderId: string, input: SendMessageInput) {
  const conversation = await getConversation(conversationId, senderId);
  const message = await conversationRepository.createMessage(conversationId, senderId, input.content);
  const publicMessage = toPublicMessage(message);
  pushMessageToUsers([conversation.customerId, conversation.breederId], publicMessage);
  return message;
}
