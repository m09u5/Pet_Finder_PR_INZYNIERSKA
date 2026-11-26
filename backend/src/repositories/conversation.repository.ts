import type { BreederProfile, Conversation, Message, Offer, User } from "@prisma/client";

export type ConversationWithRelations = Conversation & {
  offer: Pick<Offer, "id" | "title"> & { breeder: Pick<BreederProfile, "breedingName"> };
  customer: Pick<User, "id" | "firstName" | "lastName">;
  messages: Message[];
};

export interface ConversationRepository {
  findById(id: string): Promise<ConversationWithRelations | null>;
  findByOfferAndCustomer(offerId: string, customerId: string): Promise<ConversationWithRelations | null>;
  create(offerId: string, customerId: string, breederUserId: string): Promise<ConversationWithRelations>;
  listForCustomer(customerId: string): Promise<ConversationWithRelations[]>;
  listForBreeder(breederUserId: string): Promise<ConversationWithRelations[]>;
  listMessages(conversationId: string, params: { skip: number; take: number }): Promise<Message[]>;
  countMessages(conversationId: string): Promise<number>;
  createMessage(conversationId: string, senderId: string, content: string): Promise<Message>;
  markMessagesRead(conversationId: string, readerId: string): Promise<void>;
}
