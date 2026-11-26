import type { OffersFilters } from "./offers-search.types";

export const EMPTY_OFFERS_FILTERS: OffersFilters = {
  q: "",
  species: "",
  breed: "",
  sex: "",
  minPrice: "",
  maxPrice: "",
  locationText: "",
  lat: null,
  lng: null,
  radiusKm: "",
  sort: "newest",
};

export function hasOffersLocation(filters: OffersFilters) {
  return (filters.lat !== null && filters.lng !== null) || filters.locationText.trim().length > 0;
}

export function buildOffersQueryString(filters: OffersFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.species) params.set("species", filters.species);
  if (filters.breed) params.set("breed", filters.breed);
  if (filters.sex) params.set("sex", filters.sex);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (hasOffersLocation(filters) && filters.radiusKm) {
    params.set("radiusKm", filters.radiusKm);
    if (filters.lat !== null && filters.lng !== null) {
      params.set("lat", String(filters.lat));
      params.set("lng", String(filters.lng));
    } else {
      params.set("locationText", filters.locationText.trim());
    }
  }
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params.toString();
}

export function filtersFromSearchParams(params: URLSearchParams): OffersFilters {
  const sex = params.get("sex");
  const sort = params.get("sort");
  return {
    q: params.get("q") ?? "",
    species: params.get("species") ?? "",
    breed: params.get("breed") ?? "",
    sex: sex === "MALE" || sex === "FEMALE" ? sex : "",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    locationText: params.get("locationText") ?? "",
    lat: params.get("lat") ? Number(params.get("lat")) : null,
    lng: params.get("lng") ? Number(params.get("lng")) : null,
    radiusKm: params.get("radiusKm") ?? "",
    sort: sort === "price_asc" || sort === "price_desc" || sort === "distance" ? sort : "newest",
  };
}
