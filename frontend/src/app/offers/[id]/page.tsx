import { OfferDetailClient } from "./OfferDetailClient";

export default async function OfferDetailPage({ params }: PageProps<"/offers/[id]">) {
  const { id } = await params;
  return <OfferDetailClient id={id} />;
}
