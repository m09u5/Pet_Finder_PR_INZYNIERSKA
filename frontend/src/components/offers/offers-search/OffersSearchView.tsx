"use client";

import { OffersFilterPanel } from "@/components/offers/offers-filter-panel/OffersFilterPanel";
import { OffersGrid } from "@/components/offers/offers-grid/OffersGrid";
import { useOffersSearch } from "./useOffersSearch";

export function OffersSearchView() {
  const search = useOffersSearch();

  return (
    <div className="p-6">
      <OffersFilterPanel
        filters={search.filters}
        hasLocation={search.hasLocation}
        locationMessage={search.locationMessage}
        onChangeAction={search.setFilter}
        onLocationTextChangeAction={search.setLocationText}
        onUseMyLocationAction={search.requestMyLocation}
        onResetAction={search.resetFilters}
      />
      <OffersGrid offers={search.offers} isLoading={search.isLoading} hasError={search.hasError} />
    </div>
  );
}
