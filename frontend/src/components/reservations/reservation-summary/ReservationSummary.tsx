import Link from "next/link";
import clsx from "clsx";
import {
  formatDate,
  formatDateTime,
  formatPrice,
  getReservationStage,
} from "@/components/reservations/shared/reservation.utils";
import { detailRowClass, whiteBoxClass } from "@/styles/theme";
import type { ReservationSummaryProps } from "./reservation-summary.types";

export function ReservationSummary({ reservation }: ReservationSummaryProps) {
  const { animal, offer, status, depositAmount, paidAt, pickupDate, createdAt } = reservation;
  const isActive = status !== "CANCELLED";

  return (
    <div className={clsx(whiteBoxClass, "flex flex-col gap-4 text-sm")}>
      <div>
        <Link href={`/offers/${offer.id}`} className="text-2xl hover:underline">
          {animal.name}
        </Link>
        <p className="text-gray-600">
          {animal.species} / {animal.breed} · {offer.breedingName}
        </p>
      </div>

      <dl className="flex flex-col">
        <div className={detailRowClass}>
          <dt>Data rezerwacji</dt>
          <dd>{formatDate(createdAt)}</dd>
        </div>
        {getReservationStage(reservation) === "UNPAID" && (
          <div className={detailRowClass}>
            <dt>Opłać do</dt>
            <dd className="font-semibold">{formatDateTime(reservation.paymentDeadline)}</dd>
          </div>
        )}
        {isActive && (
          <>
            <div className={detailRowClass}>
              <dt>Data odbioru</dt>
              <dd>{pickupDate ? formatDate(pickupDate) : "jeszcze nie wybrano"}</dd>
            </div>
            <div className={detailRowClass}>
              <dt>Miejsce odbioru</dt>
              <dd className="text-right">
                {offer.street}, {offer.postalCode} {offer.city}
              </dd>
            </div>
          </>
        )}
        {(isActive || paidAt) && (
          <div className={detailRowClass}>
            <dt>{paidAt ? `Zaliczka (opłacona ${formatDate(paidAt)})` : "Zaliczka do opłacenia teraz"}</dt>
            <dd>{formatPrice(depositAmount)}</dd>
          </div>
        )}
        {isActive && (
          <div className={detailRowClass}>
            <dt>Pozostało przy odbiorze</dt>
            <dd>{formatPrice(Math.max(animal.price - depositAmount, 0))}</dd>
          </div>
        )}
        <div className={clsx(detailRowClass, "text-xl font-semibold")}>
          <dt>Cena</dt>
          <dd>{formatPrice(animal.price)}</dd>
        </div>
      </dl>
    </div>
  );
}
