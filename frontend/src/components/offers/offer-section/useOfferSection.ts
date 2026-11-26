import { useQuery } from "@tanstack/react-query";
import type { OffersSearchResponse } from "@/components/offers/offers-search/offers-search.types";
import { apiFetch } from "@/lib/api";

export function useOfferSection(queryKey: readonly unknown[], path: string, enabled: boolean) {
  const { data } = useQuery({
    queryKey,
    queryFn: () => apiFetch<OffersSearchResponse>(path),
    enabled,
  });

  return data?.items ?? [];
}
