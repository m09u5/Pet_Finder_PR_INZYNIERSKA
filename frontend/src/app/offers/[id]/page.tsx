import { OfferDetail } from "@/components/offers/offer-detail/OfferDetail";

export default async function OfferDetailPage({ params }: PageProps<"/offers/[id]">) {
  const { id } = await params;
  return <OfferDetail offerId={id} />;
}
