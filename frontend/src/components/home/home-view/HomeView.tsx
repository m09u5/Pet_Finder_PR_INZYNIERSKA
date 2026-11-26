"use client";

import clsx from "clsx";
import { OfferSection } from "@/components/offers/offer-section/OfferSection";
import { useGeolocation } from "@/hooks/use-geolocation/useGeolocation";
import { containerClass } from "@/styles/theme";
import { getDistanceText, getRatingText, getStartingPriceText } from "./home-view.utils";

const NEAREST_RADIUS_KM = 200;

export function HomeView() {
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
