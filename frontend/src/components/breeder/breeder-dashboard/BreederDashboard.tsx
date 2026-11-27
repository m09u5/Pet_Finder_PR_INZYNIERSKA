"use client";

import { OfferView } from "@/components/offers/offer-view/OfferView";
import { offerPageClass, pageClass } from "@/styles/theme";
import { useBreederDashboard } from "./useBreederDashboard";

export function BreederDashboard() {
  const { breeder, offer, isLoading } = useBreederDashboard();

  if (isLoading) return <p className={pageClass}>Ładowanie...</p>;
  if (!breeder) return null;

  return (
    <div className={offerPageClass}>
      <OfferView offer={offer ?? null} breeder={offer?.breeder ?? breeder} isOwner />
    </div>
  );
}
