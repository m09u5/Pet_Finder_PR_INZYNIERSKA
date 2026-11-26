import { useQuery } from "@tanstack/react-query";
import type { PublicBreederProfile, PublicOffer } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";

export function useBreederDashboard() {
  const profileQuery = useQuery({
    queryKey: ["my-breeder-profile"],
    queryFn: () => apiFetch<{ breeder: PublicBreederProfile }>("/api/breeders/me"),
  });

  const offerQuery = useQuery({
    queryKey: ["my-offer"],
    queryFn: () => apiFetch<{ offer: PublicOffer | null }>("/api/offers/mine"),
  });

  return {
    breeder: profileQuery.data?.breeder,
    offer: offerQuery.data?.offer,
    isLoading: profileQuery.isLoading || offerQuery.isLoading,
  };
}
