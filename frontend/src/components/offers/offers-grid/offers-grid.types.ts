import type { PublicOfferSearchResult } from "@pet-finder/shared";

export interface OffersGridProps {
  offers: PublicOfferSearchResult[];
  isLoading: boolean;
  hasError: boolean;
}
