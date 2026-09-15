import type { BreederProfile, Conversation, Message, Offer, User } from "@prisma/client";
import type { PublicConversation } from "@pet-finder/shared";
import { toPublicMessage } from "./publicMessage";

type ConversationWithRelations = Conversation & {
  offer: Pick<Offer, "id" | "title"> & { breeder: Pick<BreederProfile, "breedingName"> };
  customer: Pick<User, "id" | "firstName" | "lastName">;
  messages: Message[];
};

export function toPublicConversation(conversation: ConversationWithRelations): PublicConversation {
  return {
    id: conversation.id,
    offerId: conversation.offer.id,
    offerTitle: conversation.offer.title,
    breedingName: conversation.offer.breeder.breedingName,
    customerId: conversation.customer.id,
    customerName: `${conversation.customer.firstName} ${conversation.customer.lastName}`,
    breederUserId: conversation.breederId,
    createdAt: conversation.createdAt.toISOString(),
    lastMessage: conversation.messages[0] ? toPublicMessage(conversation.messages[0]) : null,
  };
}
