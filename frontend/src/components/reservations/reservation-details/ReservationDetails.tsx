"use client";

import Link from "next/link";
import clsx from "clsx";
import { ReservationPayment } from "@/components/reservations/reservation-payment/ReservationPayment";
import { ReservationStatusBadge } from "@/components/reservations/reservation-status-badge/ReservationStatusBadge";
import { ReservationSummary } from "@/components/reservations/reservation-summary/ReservationSummary";
import { getReservationStage } from "@/components/reservations/shared/reservation.utils";
import {
  buttonClass,
  errorTextClass,
  narrowPageClass,
  offerPanelClass,
  pageClass,
  pageTitleClass,
  whiteBoxClass,
} from "@/styles/theme";
import type { ReservationDetailsProps } from "./reservation-details.types";
import { STAGE_DESCRIPTIONS } from "./reservation-details.utils";
import { useReservation } from "./useReservation";

export function ReservationDetails({ reservationId }: ReservationDetailsProps) {
  const { reservation, isLoading, cancel, cancelling, actionError } = useReservation(reservationId);

  if (isLoading) return <p className={pageClass}>Ładowanie...</p>;
  if (!reservation) return <p className={pageClass}>Nie udało się pobrać rezerwacji.</p>;

  const stage = getReservationStage(reservation);

  return (
    <div className={clsx(narrowPageClass, "w-full")}>
      <div className={clsx(offerPanelClass, "p-4 flex flex-col gap-4")}>
        <div className={clsx(whiteBoxClass, "flex flex-col gap-2")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className={clsx(pageTitleClass, "mb-0 font-semibold")}>Twoja rezerwacja</h1>
            <ReservationStatusBadge reservation={reservation} />
          </div>
          <p className="text-sm text-gray-600">{STAGE_DESCRIPTIONS[stage]}</p>
        </div>

        <ReservationSummary reservation={reservation} />

        {stage === "UNPAID" && <ReservationPayment reservation={reservation} />}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/reservations" className={buttonClass({ variant: "outline", className: "bg-white" })}>
            Moje rezerwacje
          </Link>
          {reservation.status === "PENDING" && (
            <button
              type="button"
              onClick={cancel}
              disabled={cancelling}
              className={buttonClass({ variant: "danger" })}
            >
              Anuluj rezerwację
            </button>
          )}
        </div>
        {actionError && <p className={errorTextClass}>{actionError}</p>}
      </div>
    </div>
  );
}
