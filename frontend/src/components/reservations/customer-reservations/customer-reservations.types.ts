import type { UseReservationsQueryResult } from "@/components/reservations/shared/reservations.types";

export interface UseCustomerReservationsResult extends UseReservationsQueryResult {
  cancel: (id: string) => void;
  cancelling: boolean;
  actionError: string | null;
}
