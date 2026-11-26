import type { PublicOfferSearchResult } from "@pet-finder/shared";

export type OffersSex = "" | "MALE" | "FEMALE";

export type OffersSort = "newest" | "price_asc" | "price_desc" | "distance";

export interface OffersFilters {
  q: string;
  species: string;
  breed: string;
  sex: OffersSex;
  minPrice: string;
  maxPrice: string;
  locationText: string;
  lat: number | null;
  lng: number | null;
  radiusKm: string;
  sort: OffersSort;
}

export type OffersFilterChangeHandler = <K extends keyof OffersFilters>(key: K, value: OffersFilters[K]) => void;

export interface OffersSearchResponse {
  items: PublicOfferSearchResult[];
}

export interface UseOffersSearchResult {
  filters: OffersFilters;
  hasLocation: boolean;
  locationMessage: string | null;
  setFilter: OffersFilterChangeHandler;
  setLocationText: (value: string) => void;
  requestMyLocation: () => void;
  resetFilters: () => void;
  offers: PublicOfferSearchResult[];
  isLoading: boolean;
  hasError: boolean;
}
