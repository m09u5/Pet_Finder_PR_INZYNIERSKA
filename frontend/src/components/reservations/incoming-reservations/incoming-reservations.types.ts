import type { UseReservationsQueryResult } from "@/components/reservations/shared/reservations.types";

export interface UseIncomingReservationsResult extends UseReservationsQueryResult {
  confirm: (id: string) => void;
  reject: (id: string) => void;
  updating: boolean;
  actionError: string | null;
}
