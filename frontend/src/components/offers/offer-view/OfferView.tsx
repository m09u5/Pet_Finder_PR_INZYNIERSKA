import { AnimalListItem } from "@/components/animals/animal-list-item/AnimalListItem";
import { AddAnimalForm } from "@/components/animals/form/add-animal-form/AddAnimalForm";
import { BreederHeader } from "@/components/breeder/breeder-header/BreederHeader";
import { EditableGallery } from "@/components/images/editable-gallery/EditableGallery";
import { MessageBreederButton } from "@/components/offers/message-breeder-button/MessageBreederButton";
import type { OfferViewProps } from "./offer-view.types";

export function OfferView({ offer, isOwner }: OfferViewProps) {
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

      {!isOwner && <MessageBreederButton offerId={offer.id} />}

      <div className="border-t border-gray-200 pt-6">
        <EditableGallery
          images={offer.images}
          alt={offer.breeder.breedingName}
          editable={isOwner}
          uploadUrl={`/api/offers/${offer.id}/images`}
        />
      </div>

      {offer.animals.map((animal) => (
        <AnimalListItem key={animal.id} offerId={offer.id} animal={animal} editable={isOwner} />
      ))}

      {offer.animals.length === 0 && <p className="text-gray-500 mt-6">Brak zwierząt w tym ogłoszeniu.</p>}

      {isOwner && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <AddAnimalForm />
        </div>
      )}
    </div>
  );
}
