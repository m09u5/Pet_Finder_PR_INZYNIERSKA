"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PublicOfferSearchResult } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import { OfferCard } from "@/components/OfferCard";
import { STATIC_BREEDER_RATING } from "@/lib/staticRating";

function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "granted" | "denied">("idle");

  useEffect(() => {
    if (!navigator.geolocation) {
      queueMicrotask(() => setStatus("denied"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("granted");
      },
      () => setStatus("denied"),
    );
  }, []);

  return { coords, status };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="mt-1 h-0.5 w-16 bg-emerald-600 rounded" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">{children}</div>
    </section>
  );
}

export default function HomePage() {
  const { coords, status } = useGeolocation();

  const nearest = useQuery({
    queryKey: ["home-nearest", coords],
    queryFn: () =>
      apiFetch<{ items: PublicOfferSearchResult[] }>(
        `/api/offers?lat=${coords!.lat}&lng=${coords!.lng}&radiusKm=200&sort=distance&limit=8`,
      ),
    enabled: status === "granted" && coords !== null,
  });

  const topRated = useQuery({
    queryKey: ["home-top-rated"],
    queryFn: () => apiFetch<{ items: PublicOfferSearchResult[] }>("/api/offers?limit=8"),
  });

  const more = useQuery({
    queryKey: ["home-more"],
    queryFn: () => apiFetch<{ items: PublicOfferSearchResult[] }>("/api/offers?sort=price_asc&limit=8"),
  });

  const nearestItems = nearest.data?.items ?? [];
  const topRatedItems = topRated.data?.items ?? [];
  const moreItems = more.data?.items ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {status === "granted" && nearestItems.length > 0 && (
          <Section title="Najbliżej ciebie">
            {nearestItems.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                overlayText={offer.distanceKm !== null ? `tylko ${offer.distanceKm.toFixed(0)} km` : ""}
              />
            ))}
          </Section>
        )}

        {topRatedItems.length > 0 && (
          <Section title="Najwyżej oceniani hodowcy">
            {topRatedItems.map((offer) => (
              <OfferCard key={offer.id} offer={offer} overlayText={`★ ${STATIC_BREEDER_RATING}`} />
            ))}
          </Section>
        )}

        {moreItems.length > 0 && (
          <Section title="Sprawdź również">
            {moreItems.map((offer) => {
              const minPrice = Math.min(...offer.animals.map((animal) => animal.price));
              return <OfferCard key={offer.id} offer={offer} overlayText={`od ${minPrice} zł`} />;
            })}
          </Section>
        )}
      </div>
    </div>
  );
}
