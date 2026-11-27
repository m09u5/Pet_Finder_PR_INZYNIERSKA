import clsx from "clsx";
import { getReservationStage, RESERVATION_STAGE_LABELS } from "@/components/reservations/shared/reservation.utils";
import { statusBadgeClass } from "@/styles/theme";
import type { ReservationStatusBadgeProps } from "./reservation-status-badge.types";

export function ReservationStatusBadge({ reservation }: ReservationStatusBadgeProps) {
  const stage = getReservationStage(reservation);

  return (
    <span
      className={clsx(
        statusBadgeClass,
        stage === "UNPAID" && "bg-amber-100 text-amber-800",
        stage === "AWAITING_APPROVAL" && "bg-sky-100 text-sky-800",
        stage === "CONFIRMED" && "bg-emerald-100 text-emerald-800",
        (stage === "CANCELLED" || stage === "EXPIRED") && "bg-gray-200 text-gray-600",
      )}
    >
      {RESERVATION_STAGE_LABELS[stage]}
    </span>
  );
}
