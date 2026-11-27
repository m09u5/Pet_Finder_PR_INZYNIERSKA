import clsx from "clsx";
import { AnimalListItem } from "@/components/animals/animal-list-item/AnimalListItem";
import { AddAnimalForm } from "@/components/animals/form/add-animal-form/AddAnimalForm";
import { BreederHeader } from "@/components/breeder/breeder-header/BreederHeader";
import { EditableGallery } from "@/components/images/editable-gallery/EditableGallery";
import { MessageBreederButton } from "@/components/offers/message-breeder-button/MessageBreederButton";
import { mutedTextClass, offerPanelClass, whiteBoxClass } from "@/styles/theme";
import type { OfferViewProps } from "./offer-view.types";
import { getAnimalsHeading, getMainGallery } from "./offer-view.utils";

export function OfferView({ offer, breeder, isOwner }: OfferViewProps) {
  const animals = offer?.animals ?? [];
  const gallery = getMainGallery(offer?.images, animals);

  return (
    <div className={offerPanelClass}>
      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <EditableGallery
            variant="hero"
            images={gallery.images}
            alt={breeder.breedingName}
            editable={isOwner && offer !== null}
            deletable={gallery.isOwnGallery}
            uploadUrl={`/api/offers/${offer?.id}/images`}
          />
          {isOwner && !offer && (
            <p className={clsx(mutedTextClass, "px-4 pt-2")}>
              Zdjęcia do galerii dodasz po dodaniu pierwszego zwierzęcia.
            </p>
          )}
        </div>

        <div className="p-6 flex flex-col gap-6">
          <BreederHeader
            breedingName={breeder.breedingName}
            verificationStatus={breeder.verificationStatus}
            street={breeder.street}
            city={breeder.city}
            description={breeder.description}
            logoUrl={breeder.logoUrl}
            editable={isOwner}
          />
          {!isOwner && offer && <MessageBreederButton offerId={offer.id} />}
        </div>
      </div>

      <section className="px-4 py-8 sm:px-14 flex flex-col gap-8">
        <h2 className={clsx(whiteBoxClass, "self-center px-20 text-2xl text-center")}>{getAnimalsHeading(animals)}</h2>

        {offer &&
          animals.map((animal) => (
            <AnimalListItem key={animal.id} offerId={offer.id} animal={animal} editable={isOwner} />
          ))}

        {animals.length === 0 && (
          <p className={clsx(mutedTextClass, "text-center")}>
            {isOwner ? "Nie masz jeszcze żadnych zwierząt w hodowli." : "Brak zwierząt w tym ogłoszeniu."}
          </p>
        )}

        {isOwner && <AddAnimalForm />}
      </section>
    </div>
  );
}
