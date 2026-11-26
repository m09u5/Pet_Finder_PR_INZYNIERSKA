import { Suspense } from "react";
import { OffersSearchView } from "@/components/offers/offers-search/OffersSearchView";

export default function OffersPage() {
  return (
    <Suspense fallback={<p className="p-6">Ładowanie...</p>}>
      <OffersSearchView />
    </Suspense>
  );
}
