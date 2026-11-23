import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import type { SearchFilterChangeHandler, SearchFilters, UseSearchFormResult } from "./search-bar.types";

const INITIAL_FILTERS: SearchFilters = {
  q: "",
  locationText: "",
  species: "",
  breed: "",
  sex: "",
  minPrice: "",
  maxPrice: "",
  radiusKm: "50",
};

function buildSearchParams(filters: SearchFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.species) params.set("species", filters.species);
  if (filters.breed) params.set("breed", filters.breed);
  if (filters.sex) params.set("sex", filters.sex);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.locationText.trim()) {
    params.set("locationText", filters.locationText.trim());
    params.set("radiusKm", filters.radiusKm);
  }
  return params;
}

export function useSearchForm(): UseSearchFormResult {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setFilter: SearchFilterChangeHandler = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  function submit(event?: SyntheticEvent) {
    event?.preventDefault();
    setFiltersOpen(false);
    router.push(`/offers?${buildSearchParams(filters).toString()}`);
  }

  return { filters, setFilter, filtersOpen, setFiltersOpen, submit };
}
