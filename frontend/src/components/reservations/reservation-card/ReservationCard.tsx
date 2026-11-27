import Link from "next/link";
import { ReservationStatusBadge } from "@/components/reservations/reservation-status-badge/ReservationStatusBadge";
import {
  formatDate,
  formatDateTime,
  getReservationStage,
} from "@/components/reservations/shared/reservation.utils";
import { listCardClass, mutedTextClass } from "@/styles/theme";
import type { ReservationCardProps } from "./reservation-card.types";

export function ReservationCard({ reservation, details, children }: ReservationCardProps) {
  return (
    <div className={listCardClass}>
      <div>
        <Link href={`/offers/${reservation.offer.id}`} className="font-medium hover:underline">
          {reservation.animal.name} — {reservation.animal.breed}
        </Link>
        <p className={mutedTextClass}>{details}</p>
        <p className={mutedTextClass}>
          Utworzono: {formatDate(reservation.createdAt)}
          {reservation.pickupDate && ` · Odbiór: ${formatDate(reservation.pickupDate)}`}
          {getReservationStage(reservation) === "UNPAID" &&
            ` · Termin płatności: ${formatDateTime(reservation.paymentDeadline)}`}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <ReservationStatusBadge reservation={reservation} />
        {children}
      </div>
    </div>
  );
}
