import { useQuery } from "@tanstack/react-query";
import type { PublicReservation } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import type { UseReservationsQueryResult } from "./reservations.types";

export function useReservationsQuery(queryKey: string, path: string): UseReservationsQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey],
    queryFn: () => apiFetch<{ reservations: PublicReservation[] }>(path),
  });

  return { reservations: data?.reservations ?? [], isLoading, hasError: !!error };
}
