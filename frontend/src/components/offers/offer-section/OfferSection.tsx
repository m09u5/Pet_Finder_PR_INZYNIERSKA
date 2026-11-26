"use client";

import { OfferCard } from "@/components/offers/offer-card/OfferCard";
import type { OfferSectionProps } from "./offer-section.types";
import { useOfferSection } from "./useOfferSection";

export function OfferSection({ title, queryKey, path, enabled = true, getOverlayTextAction }: OfferSectionProps) {
  const offers = useOfferSection(queryKey, path, enabled);
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
