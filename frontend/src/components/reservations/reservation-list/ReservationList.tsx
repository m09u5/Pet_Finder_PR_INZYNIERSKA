import clsx from "clsx";
import { errorTextClass, listClass, pageClass, pageTitleClass } from "@/styles/theme";
import type { ReservationListProps } from "./reservation-list.types";

export function ReservationList({
  title,
  emptyMessage,
  isLoading,
  hasError,
  isEmpty,
  actionError,
  children,
}: ReservationListProps) {
  return (
    <div className={pageClass}>
      <h1 className={pageTitleClass}>{title}</h1>
      {isLoading && <p>Ładowanie...</p>}
      {hasError && <p className="text-red-600">Nie udało się pobrać rezerwacji.</p>}
      {!isLoading && !hasError && isEmpty && <p>{emptyMessage}</p>}

      <div className={listClass}>{children}</div>
      {actionError && <p className={clsx(errorTextClass, "mt-2")}>{actionError}</p>}
    </div>
  );
}
