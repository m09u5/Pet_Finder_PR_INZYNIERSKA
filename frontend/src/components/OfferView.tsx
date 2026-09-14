"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { PublicOffer } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import { BreederHeader } from "@/components/BreederHeader";
import { ImageGallery } from "@/components/ImageGallery";
import { ImageUploader } from "@/components/ImageUploader";
import { AnimalListItem } from "@/components/AnimalListItem";
import { AddAnimalForm } from "@/components/AddAnimalForm";

export function OfferView({ offer, isOwner }: { offer: PublicOffer; isOwner: boolean }) {
  const queryClient = useQueryClient();

  async function handleDeleteImage(imageId: string) {
    await apiFetch(`/api/images/${imageId}`, { method: "DELETE" });
    await queryClient.invalidateQueries({ queryKey: ["offer"] });
    await queryClient.invalidateQueries({ queryKey: ["my-offer"] });
    await queryClient.invalidateQueries({ queryKey: ["offers"] });
  }

  return (
    <div>
      <BreederHeader
        breedingName={offer.breeder.breedingName}
        verificationStatus={offer.breeder.verificationStatus}
        street={offer.breeder.street}
        city={offer.breeder.city}
        postalCode={offer.breeder.postalCode}
        description={offer.breeder.description}
        editable={isOwner}
      />

      <div className="border-t pt-6">
        <ImageGallery
          images={offer.images}
          alt={offer.breeder.breedingName}
          onDeleteAction={isOwner ? handleDeleteImage : undefined}
        />
        {isOwner && <ImageUploader uploadUrl={`/api/offers/${offer.id}/images`} />}
      </div>

      {offer.animals.map((animal) => (
        <AnimalListItem key={animal.id} offerId={offer.id} animal={animal} editable={isOwner} />
      ))}

      {offer.animals.length === 0 && <p className="text-gray-500 mt-6">Brak zwierząt w tym ogłoszeniu.</p>}

      {isOwner && (
        <div className="mt-6 border-t pt-6">
          <AddAnimalForm />
        </div>
      )}
    </div>
  );
}
