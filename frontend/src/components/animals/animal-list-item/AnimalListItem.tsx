"use client";

import { AnimalActions } from "@/components/animals/animal-actions/AnimalActions";
import { AnimalDetails } from "@/components/animals/animal-details/AnimalDetails";
import { EditableGallery } from "@/components/images/editable-gallery/EditableGallery";
import { IconButton } from "@/components/ui/icon-button/IconButton";
import { PencilIcon } from "@/components/ui/icons/PencilIcon";
import { whiteBoxClass } from "@/styles/theme";
import type { AnimalListItemProps } from "./animal-list-item.types";
import { AnimalForm } from "@/components/animals/form/animal-form/AnimalForm";
import { useEditAnimal } from "./useEditAnimal";

export function AnimalListItem({ offerId, animal, editable }: AnimalListItemProps) {
  const controller = useEditAnimal(offerId, animal);

  if (controller.isEditing) {
    return (
      <div className={whiteBoxClass}>
        <AnimalForm
          form={controller.form}
          error={controller.error}
          saving={controller.saving}
          submitLabel="Zapisz zmiany"
          onChangeAction={controller.setField}
          onSubmitAction={controller.submit}
          onCancelAction={controller.cancel}
        />
      </div>
    );
  }

  return (
    <article className="flex flex-col sm:flex-row gap-3">
      <div className="w-full sm:w-56 shrink-0">
        <EditableGallery
          variant="square"
          images={animal.images}
          alt={animal.name}
          editable={editable}
          uploadUrl={`/api/offers/${offerId}/animals/${animal.id}/images`}
          minImages={1}
        />
      </div>
      <AnimalDetails
        animal={animal}
        headerAction={
          editable && (
            <IconButton label={`Edytuj: ${animal.name}`} onClickAction={controller.startEditing}>
              <PencilIcon />
            </IconButton>
          )
        }
      >
        {!editable && <AnimalActions animal={animal} />}
      </AnimalDetails>
    </article>
  );
}
