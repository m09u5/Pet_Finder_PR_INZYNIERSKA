import { useQuery } from "@tanstack/react-query";
import type { PublicReservation } from "@pet-finder/shared";
import { useReservationAction } from "@/components/reservations/shared/useReservationAction";
import { apiFetch } from "@/lib/api";
import type { UseReservationResult } from "./reservation-details.types";

export function useReservation(reservationId: string): UseReservationResult {
  const { data, isLoading } = useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: () => apiFetch<{ reservation: PublicReservation }>(`/api/reservations/${reservationId}`),
  });
  const cancelMutation = useReservationAction("cancel");

  return {
    reservation: data?.reservation ?? null,
    isLoading,
    cancel: () => cancelMutation.mutate(reservationId),
    cancelling: cancelMutation.isPending,
    actionError: cancelMutation.isError ? "Nie udało się anulować rezerwacji" : null,
  };
}
