"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { PublicConversation, PublicOffer } from "@pet-finder/shared";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { BreederHeader } from "@/components/BreederHeader";
import { ImageGallery } from "@/components/ImageGallery";
import { ImageUploader } from "@/components/ImageUploader";
import { AnimalListItem } from "@/components/AnimalListItem";
import { AddAnimalForm } from "@/components/AddAnimalForm";

export function OfferView({ offer, isOwner }: { offer: PublicOffer; isOwner: boolean }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();
  const [startingConversation, setStartingConversation] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);

  async function handleDeleteImage(imageId: string) {
    await apiFetch(`/api/images/${imageId}`, { method: "DELETE" });
    await queryClient.invalidateQueries({ queryKey: ["offer"] });
    await queryClient.invalidateQueries({ queryKey: ["my-offer"] });
    await queryClient.invalidateQueries({ queryKey: ["offers"] });
  }

  async function handleMessageBreeder() {
    setMessageError(null);
    setStartingConversation(true);
    try {
      const { conversation } = await apiFetch<{ conversation: PublicConversation }>("/api/conversations", {
        method: "POST",
        body: JSON.stringify({ offerId: offer.id }),
      });
      router.push(`/messages/${conversation.id}`);
    } catch (err) {
      setMessageError(err instanceof ApiError ? err.message : "Nie udało się rozpocząć rozmowy");
    } finally {
      setStartingConversation(false);
    }
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

      {!isOwner && user?.role === "CUSTOMER" && (
        <div className="mb-6">
          <button
            onClick={handleMessageBreeder}
            disabled={startingConversation}
            className="border px-4 py-2 rounded disabled:opacity-50"
          >
            {startingConversation ? "Otwieranie..." : "Napisz do hodowcy"}
          </button>
          {messageError && <p className="text-red-600 text-sm mt-1">{messageError}</p>}
        </div>
      )}

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
