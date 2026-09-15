"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import type { PublicOffer } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import { STATIC_BREEDER_RATING } from "@/lib/staticRating";

export default function OffersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["offers"],
    queryFn: () => apiFetch<{ items: PublicOffer[] }>("/api/offers"),
  });

  if (isLoading) return <p className="p-6">Ładowanie...</p>;
  if (error) return <p className="p-6 text-red-600">Nie udało się pobrać ogłoszeń.</p>;
  if (!data?.items.length) return <p className="p-6">Brak ogłoszeń.</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.items.map((offer) => (
        <Link key={offer.id} href={`/offers/${offer.id}`} className="border rounded overflow-hidden block hover:shadow">
          <div className="relative w-full h-40 bg-gray-100">
            <Image
              src={offer.images[0].url}
              alt={offer.breeder.breedingName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
            <span className="absolute top-2 left-2 bg-white/90 text-sm px-2 py-1 rounded">
              {offer.breeder.breedingName}
            </span>
          </div>
          <div className="p-3">
            <p className="text-sm text-gray-500 mb-1">
              ★ {STATIC_BREEDER_RATING} · {offer.breeder.city}
            </p>
            <p className="font-medium">{offer.title}</p>
            <p className="text-sm text-gray-500">
              {offer.animals.length} {offer.animals.length === 1 ? "zwierzę dostępne" : "zwierząt dostępnych"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
