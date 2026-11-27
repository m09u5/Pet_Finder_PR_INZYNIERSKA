import type { PublicOffer, PublicOfferBreeder } from "@pet-finder/shared";

export interface OfferViewProps {
  offer: PublicOffer | null;
  breeder: PublicOfferBreeder;
  isOwner: boolean;
}
