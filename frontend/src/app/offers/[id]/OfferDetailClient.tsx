"use client";

import { useQuery } from "@tanstack/react-query";
import type { PublicOffer } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { OfferView } from "@/components/OfferView";

export function OfferDetailClient({ id }: { id: string }) {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["offer", id],
    queryFn: () => apiFetch<{ offer: PublicOffer }>(`/api/offers/${id}`),
  });

  if (isLoading) return <p className="p-6">Ładowanie...</p>;
  if (error || !data) return <p className="p-6 text-red-600">Nie znaleziono ogłoszenia.</p>;

  const isOwner = user?.id === data.offer.breeder.userId;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <OfferView offer={data.offer} isOwner={isOwner} />
    </div>
  );
}
