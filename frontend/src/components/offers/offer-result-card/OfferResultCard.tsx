import Link from "next/link";
import Image from "next/image";
import { STATIC_BREEDER_RATING } from "@/lib/staticRating";
import type { OfferResultCardProps } from "./offer-result-card.types";

export function OfferResultCard({ offer }: OfferResultCardProps) {
  const animalsLabel = offer.animals.length === 1 ? "zwierzę dostępne" : "zwierząt dostępnych";

  return (
    <Link href={`/offers/${offer.id}`} className="border border-gray-200 rounded-xl overflow-hidden block hover:shadow">
      <div className="relative w-full h-40 bg-gray-100">
        <Image
          src={offer.images[0].url}
          alt={offer.breeder.breedingName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute top-2 left-2 bg-white/90 text-gray-900 text-sm px-2 py-1 rounded">
          {offer.breeder.breedingName}
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-500 mb-1">
          ★ {STATIC_BREEDER_RATING} · {offer.breeder.city}
          {offer.distanceKm !== null && ` · ${offer.distanceKm.toFixed(0)} km od Ciebie`}
        </p>
        <p className="font-medium">{offer.title}</p>
        <p className="text-sm text-gray-500">
          {offer.animals.length} {animalsLabel}
        </p>
      </div>
    </Link>
  );
}
