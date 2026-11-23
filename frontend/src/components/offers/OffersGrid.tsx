import { OfferResultCard } from "./OfferResultCard";
import type { OffersGridProps } from "./offers-grid.types";

export function OffersGrid({ offers, isLoading, hasError }: OffersGridProps) {
  if (isLoading) return <p>Ładowanie...</p>;
  if (hasError) return <p className="text-red-600">Nie udało się pobrać ogłoszeń.</p>;
  if (offers.length === 0) return <p>Brak ogłoszeń spełniających kryteria.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {offers.map((offer) => (
        <OfferResultCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}
