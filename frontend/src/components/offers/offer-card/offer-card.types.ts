import type { PublicOffer, PublicOfferSearchResult } from "@pet-finder/shared";

export interface OfferCardProps {
  offer: PublicOffer | PublicOfferSearchResult;
  overlayText: string;
}
