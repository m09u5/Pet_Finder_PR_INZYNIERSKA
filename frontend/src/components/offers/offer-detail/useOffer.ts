import { useQuery } from "@tanstack/react-query";
import type { PublicOffer } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";

export function useOffer(offerId: string) {
  return useQuery({
    queryKey: ["offer", offerId],
    queryFn: () => apiFetch<{ offer: PublicOffer }>(`/api/offers/${offerId}`),
  });
}
