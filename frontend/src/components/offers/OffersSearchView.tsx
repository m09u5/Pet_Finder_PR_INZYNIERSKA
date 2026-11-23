"use client";

import { OffersFilterPanel } from "./OffersFilterPanel";
import { OffersGrid } from "./OffersGrid";
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
