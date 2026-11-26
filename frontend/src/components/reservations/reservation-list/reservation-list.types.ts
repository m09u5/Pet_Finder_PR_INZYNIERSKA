import type { ReactNode } from "react";

export interface ReservationListProps {
  title: string;
  emptyMessage: string;
  isLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
  actionError: string | null;
  children: ReactNode;
}
