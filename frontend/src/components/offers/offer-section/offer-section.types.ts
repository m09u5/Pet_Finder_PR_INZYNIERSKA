import type { PublicOfferSearchResult } from "@pet-finder/shared";

export interface OfferSectionProps {
  title: string;
  queryKey: readonly unknown[];
  path: string;
  enabled?: boolean;
  getOverlayTextAction: (offer: PublicOfferSearchResult) => string;
}
