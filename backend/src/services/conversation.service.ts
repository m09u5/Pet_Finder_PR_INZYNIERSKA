import type { CreateConversationInput, ListMessagesQuery, SendMessageInput, UserRole } from "@pet-finder/shared";
import { conversationRepository, offerRepository } from "../config/repositories";
import { toPublicMessage } from "../utils/publicMessage";
import { assertParticipant, requireActiveOffer } from "../utils/validators/conversation.validators";
import { requireFound } from "../utils/validators/found.validators";
import { pushMessageToUsers } from "../websocket/chat.ws";

export async function startConversation(customerId: string, input: CreateConversationInput) {
  const offer = requireActiveOffer(await offerRepository.findById(input.offerId));

  const existing = await conversationRepository.findByOfferAndCustomer(input.offerId, customerId);
  if (existing) {
    return { conversation: existing, created: false };
  }

  const conversation = await conversationRepository.create(input.offerId, customerId, offer.breeder.userId);
  return { conversation, created: true };
}

export function listMyConversations(userId: string, role: UserRole) {
  return role === "BREEDER"
    ? conversationRepository.listForBreeder(userId)
    : conversationRepository.listForCustomer(userId);
}

export async function getConversation(conversationId: string, userId: string) {
  const conversation = requireFound(await conversationRepository.findById(conversationId), "Rozmowa nie istnieje");
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
  pushMessageToUsers([conversation.customerId, conversation.breederId], toPublicMessage(message));
  return message;
}
