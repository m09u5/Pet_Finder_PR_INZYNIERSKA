import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { GeolocationStatus } from "@/hooks/geolocation.types";
import { apiFetch } from "@/lib/api";
import type { OffersFilterChangeHandler, OffersFilters, OffersSearchResponse, UseOffersSearchResult } from "./offers-search.types";
import {
  buildOffersQueryString,
  EMPTY_OFFERS_FILTERS,
  filtersFromSearchParams,
  hasOffersLocation,
} from "./offers-search.utils";

const DEBOUNCE_MS = 350;

const LOCATION_MESSAGES: Partial<Record<GeolocationStatus, string>> = {
  loading: "Pobieranie lokalizacji...",
  denied: "Nie udało się pobrać lokalizacji",
  unsupported: "Przeglądarka nie obsługuje geolokalizacji",
};

export function useOffersSearch(): UseOffersSearchResult {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<OffersFilters>(() => filtersFromSearchParams(searchParams));
  const geolocation = useGeolocation();
  const appliedFilters = useDebouncedValue(filters, DEBOUNCE_MS);

  const { data, isLoading, error } = useQuery({
    queryKey: ["offers", appliedFilters],
    queryFn: () => apiFetch<OffersSearchResponse>(`/api/offers?${buildOffersQueryString(appliedFilters)}`),
  });

  const setFilter: OffersFilterChangeHandler = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  function setLocationText(value: string) {
    setFilters((current) => ({ ...current, locationText: value, lat: null, lng: null }));
  }

  function requestMyLocation() {
    geolocation
      .request()
      .then((coords) => {
        setFilters((current) => ({
          ...current,
          lat: coords.lat,
          lng: coords.lng,
          locationText: "",
          radiusKm: current.radiusKm || "50",
        }));
      })
      .catch(() => undefined);
  }

  function resetFilters() {
    setFilters(EMPTY_OFFERS_FILTERS);
    geolocation.reset();
  }

  return {
    filters,
    hasLocation: hasOffersLocation(filters),
    locationMessage: LOCATION_MESSAGES[geolocation.status] ?? null,
    setFilter,
    setLocationText,
    requestMyLocation,
    resetFilters,
    offers: data?.items ?? [],
    isLoading,
    hasError: Boolean(error),
  };
}
