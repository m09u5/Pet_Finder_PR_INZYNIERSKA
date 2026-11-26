import type { SyntheticEvent } from "react";

export type SearchSex = "" | "MALE" | "FEMALE";

export interface SearchFilters {
  q: string;
  locationText: string;
  species: string;
  breed: string;
  sex: SearchSex;
  minPrice: string;
  maxPrice: string;
  radiusKm: string;
}

export type SearchFilterChangeHandler = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;

export type SearchSubmitHandler = (event?: SyntheticEvent) => void;

export interface UseSearchFormResult {
  filters: SearchFilters;
  setFilter: SearchFilterChangeHandler;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  submit: SearchSubmitHandler;
}
