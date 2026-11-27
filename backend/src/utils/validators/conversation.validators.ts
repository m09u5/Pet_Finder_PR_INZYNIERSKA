import type { ConversationWithRelations } from "../../repositories/conversation.repository";
import type { OfferWithRelations } from "../../repositories/offer.repository";
import { ForbiddenError, NotFoundError } from "../AppError";

export function requireActiveOffer(offer: OfferWithRelations | null): OfferWithRelations {
  if (!offer || offer.status !== "ACTIVE") {
    throw new NotFoundError("Ogłoszenie nie istnieje");
  }
  return offer;
}

export function assertParticipant(conversation: ConversationWithRelations, userId: string) {
  if (conversation.customerId !== userId && conversation.breederId !== userId) {
    throw new ForbiddenError("Brak dostępu do tej rozmowy", "NOT_PARTICIPANT");
  }
}
