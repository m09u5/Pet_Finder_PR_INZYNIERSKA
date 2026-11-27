import { useReservationAction } from "@/components/reservations/shared/useReservationAction";
import { useReservationsQuery } from "@/components/reservations/shared/useReservationsQuery";
import type { UseIncomingReservationsResult } from "./incoming-reservations.types";

const QUERY_KEY = "incoming-reservations";

export function useIncomingReservations(): UseIncomingReservationsResult {
  const query = useReservationsQuery(QUERY_KEY, "/api/reservations/incoming");
  const confirmMutation = useReservationAction("confirm");
  const cancelMutation = useReservationAction("cancel");
  const failed = confirmMutation.isError || cancelMutation.isError;

  return {
    ...query,
    confirm: (id) => confirmMutation.mutate(id),
    reject: (id) => cancelMutation.mutate(id),
    updating: confirmMutation.isPending || cancelMutation.isPending,
    actionError: failed ? "Nie udało się zaktualizować rezerwacji" : null,
  };
}
