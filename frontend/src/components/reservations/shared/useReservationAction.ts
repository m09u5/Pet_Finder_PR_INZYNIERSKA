import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ReservationAction } from "./reservations.types";

export function useReservationAction(action: ReservationAction, queryKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/reservations/${id}/${action}`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });
}
