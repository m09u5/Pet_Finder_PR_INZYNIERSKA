"use client";

import { AnimalActions } from "@/components/animals/animal-actions/AnimalActions";
import { AnimalDetails } from "@/components/animals/animal-details/AnimalDetails";
import { EditableGallery } from "@/components/images/editable-gallery/EditableGallery";
import type { AnimalListItemProps } from "./animal-list-item.types";
import { AnimalForm } from "@/components/animals/form/animal-form/AnimalForm";
import { useEditAnimal } from "./useEditAnimal";

export function AnimalListItem({ offerId, animal, editable }: AnimalListItemProps) {
  const controller = useEditAnimal(offerId, animal);

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      {controller.isEditing ? (
        <AnimalForm
          form={controller.form}
          error={controller.error}
          saving={controller.saving}
          submitLabel="Zapisz zmiany"
          onChangeAction={controller.setField}
          onSubmitAction={controller.submit}
          onCancelAction={controller.cancel}
        />
      ) : (
        <>
          <EditableGallery
            images={animal.images}
            alt={animal.name}
            editable={editable}
            uploadUrl={`/api/offers/${offerId}/animals/${animal.id}/images`}
          />
          <AnimalDetails animal={animal} />
          <AnimalActions animal={animal} editable={editable} onEditAction={controller.startEditing} />
        </>
      )}
    </div>
  );
}
