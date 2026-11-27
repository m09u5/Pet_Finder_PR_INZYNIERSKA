import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ReservationAction } from "./reservations.types";
import { useInvalidateReservations } from "./useInvalidateReservations";

export function useReservationAction(action: ReservationAction) {
  const invalidateReservations = useInvalidateReservations();

  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/reservations/${id}/${action}`, { method: "PATCH" }),
    onSettled: invalidateReservations,
  });
}
