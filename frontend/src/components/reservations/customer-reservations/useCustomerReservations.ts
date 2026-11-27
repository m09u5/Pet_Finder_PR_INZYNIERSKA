import { useReservationAction } from "@/components/reservations/shared/useReservationAction";
import { useReservationsQuery } from "@/components/reservations/shared/useReservationsQuery";
import type { UseCustomerReservationsResult } from "./customer-reservations.types";

const QUERY_KEY = "my-reservations";

export function useCustomerReservations(): UseCustomerReservationsResult {
  const query = useReservationsQuery(QUERY_KEY, "/api/reservations/mine");
  const cancelMutation = useReservationAction("cancel");

  return {
    ...query,
    cancel: (id) => cancelMutation.mutate(id),
    cancelling: cancelMutation.isPending,
    actionError: cancelMutation.isError ? "Nie udało się anulować rezerwacji" : null,
  };
}
