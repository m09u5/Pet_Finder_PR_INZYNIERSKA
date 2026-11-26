import type { PublicConversation, UserRole } from "@pet-finder/shared";

export function getOtherPartyName(conversation: PublicConversation, viewerRole: UserRole) {
  return viewerRole === "BREEDER" ? conversation.customerName : conversation.breedingName;
}
