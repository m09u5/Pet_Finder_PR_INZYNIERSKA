import type { OffersFilterChangeHandler, OffersFilters } from "@/components/offers/offers-search/offers-search.types";

export interface OffersFilterPanelProps {
  filters: OffersFilters;
  hasLocation: boolean;
  locationMessage: string | null;
  onChangeAction: OffersFilterChangeHandler;
  onLocationTextChangeAction: (value: string) => void;
  onUseMyLocationAction: () => void;
  onResetAction: () => void;
}
