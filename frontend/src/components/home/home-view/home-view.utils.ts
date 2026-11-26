import type { PublicOfferSearchResult } from "@pet-finder/shared";
import { STATIC_BREEDER_RATING } from "@/lib/staticRating";

export function getDistanceText(offer: PublicOfferSearchResult) {
  return offer.distanceKm !== null ? `tylko ${offer.distanceKm.toFixed(0)} km` : "";
}

export function getRatingText() {
  return `★ ${STATIC_BREEDER_RATING}`;
}

export function getStartingPriceText(offer: PublicOfferSearchResult) {
  return `od ${Math.min(...offer.animals.map((animal) => animal.price))} zł`;
}
