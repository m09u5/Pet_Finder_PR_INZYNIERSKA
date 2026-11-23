"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { OfferCard } from "./OfferCard";
import type { OfferSectionProps } from "./offer-section.types";
import type { OffersSearchResponse } from "./offers-search.types";

export function OfferSection({ title, queryKey, path, enabled = true, getOverlayTextAction }: OfferSectionProps) {
  const { data } = useQuery({
    queryKey,
    queryFn: () => apiFetch<OffersSearchResponse>(path),
    enabled,
  });

  const offers = data?.items ?? [];
  if (offers.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="mt-1 h-0.5 w-16 bg-emerald-600 rounded" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} overlayText={getOverlayTextAction(offer)} />
        ))}
      </div>
    </section>
  );
}
