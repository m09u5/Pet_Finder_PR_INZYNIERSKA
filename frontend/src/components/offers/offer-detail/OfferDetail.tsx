"use client";

import clsx from "clsx";
import { OfferView } from "@/components/offers/offer-view/OfferView";
import { useAuth } from "@/context/AuthContext";
import { narrowPageClass, pageClass } from "@/styles/theme";
import type { OfferDetailProps } from "./offer-detail.types";
import { useOffer } from "./useOffer";

export function OfferDetail({ offerId }: OfferDetailProps) {
  const { user } = useAuth();
  const { data, isLoading, error } = useOffer(offerId);

  if (isLoading) return <p className={pageClass}>Ładowanie...</p>;
  if (error || !data) return <p className={clsx(pageClass, "text-red-600")}>Nie znaleziono ogłoszenia.</p>;

  return (
    <div className={clsx(narrowPageClass, "w-full")}>
      <OfferView offer={data.offer} isOwner={user?.id === data.offer.breeder.userId} />
    </div>
  );
}
