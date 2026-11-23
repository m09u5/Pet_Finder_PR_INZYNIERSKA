import Link from "next/link";
import Image from "next/image";
import type { PublicOffer, PublicOfferSearchResult } from "@pet-finder/shared";

export function OfferCard({
  offer,
  overlayText,
}: {
  offer: PublicOffer | PublicOfferSearchResult;
  overlayText: string;
}) {
  return (
    <Link
      href={`/offers/${offer.id}`}
      className="relative block w-56 h-56 shrink-0 rounded-xl overflow-hidden bg-gray-100"
    >
      <Image
        src={offer.images[0].url}
        alt={offer.breeder.breedingName}
        fill
        sizes="224px"
        className="object-cover"
      />
      <span className="absolute top-3 left-3 bg-white/90 text-gray-900 text-xs font-medium px-3 py-1 rounded-full">
        {offer.breeder.breedingName}
      </span>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 pb-3 pt-10">
        <p className="text-white text-sm font-medium">{overlayText}</p>
      </div>
    </Link>
  );
}
