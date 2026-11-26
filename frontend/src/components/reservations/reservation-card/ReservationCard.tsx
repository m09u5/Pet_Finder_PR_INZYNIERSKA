import Link from "next/link";
import { listCardClass, mutedTextClass } from "@/styles/theme";
import type { ReservationCardProps } from "./reservation-card.types";
import { RESERVATION_STATUS_LABELS } from "./reservation-card.utils";

export function ReservationCard({ reservation, details, children }: ReservationCardProps) {
  return (
    <div className={listCardClass}>
      <div>
        <Link href={`/offers/${reservation.offer.id}`} className="font-medium hover:underline">
          {reservation.animal.name} — {reservation.animal.breed}
        </Link>
        <p className={mutedTextClass}>{details}</p>
        <p className={mutedTextClass}>Utworzono: {new Date(reservation.createdAt).toLocaleDateString("pl-PL")}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-900">
          {RESERVATION_STATUS_LABELS[reservation.status]}
        </span>
        {children}
      </div>
    </div>
  );
}
