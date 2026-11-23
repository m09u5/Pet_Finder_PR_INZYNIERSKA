"use client";

import clsx from "clsx";
import type { PublicOfferSearchResult } from "@pet-finder/shared";
import { OfferSection } from "@/components/offers/OfferSection";
import { useGeolocation } from "@/hooks/useGeolocation";
import { STATIC_BREEDER_RATING } from "@/lib/staticRating";
import { containerClass } from "@/styles/theme";

const NEAREST_RADIUS_KM = 200;

function getDistanceText(offer: PublicOfferSearchResult) {
  return offer.distanceKm !== null ? `tylko ${offer.distanceKm.toFixed(0)} km` : "";
}

function getRatingText() {
  return `★ ${STATIC_BREEDER_RATING}`;
}

function getStartingPriceText(offer: PublicOfferSearchResult) {
  return `od ${Math.min(...offer.animals.map((animal) => animal.price))} zł`;
}

export default function HomePage() {
  const { coords, status } = useGeolocation({ auto: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={clsx(containerClass, "py-8")}>
        <OfferSection
          title="Najbliżej ciebie"
          queryKey={["home-nearest", coords]}
          path={
            coords
              ? `/api/offers?lat=${coords.lat}&lng=${coords.lng}&radiusKm=${NEAREST_RADIUS_KM}&sort=distance&limit=8`
              : ""
          }
          enabled={status === "granted" && coords !== null}
          getOverlayTextAction={getDistanceText}
        />
        <OfferSection
          title="Najwyżej oceniani hodowcy"
          queryKey={["home-top-rated"]}
          path="/api/offers?limit=8"
          getOverlayTextAction={getRatingText}
        />
        <OfferSection
          title="Sprawdź również"
          queryKey={["home-more"]}
          path="/api/offers?sort=price_asc&limit=8"
          getOverlayTextAction={getStartingPriceText}
        />
      </div>
    </div>
  );
}
