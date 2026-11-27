"use client";

import { buttonClass } from "@/styles/theme";
import { AnimalForm } from "@/components/animals/form/animal-form/AnimalForm";
import { AnimalPhotoPicker } from "@/components/animals/form/animal-photo-picker/AnimalPhotoPicker";
import { useAddAnimal } from "./useAddAnimal";

export function AddAnimalForm() {
  const controller = useAddAnimal();

  if (!controller.isOpen) {
    return (
      <button type="button" onClick={controller.open} className={buttonClass()}>
        Dodaj zwierzę
      </button>
    );
  }

  return (
    <AnimalForm
      form={controller.form}
      error={controller.error}
      saving={controller.saving}
      submitLabel="Dodaj zwierzę"
      onChangeAction={controller.setField}
      onSubmitAction={controller.submit}
      onCancelAction={controller.cancel}
    >
      <AnimalPhotoPicker
        photos={controller.photos}
        disabled={controller.saving}
        onAddAction={controller.addPhotos}
        onRemoveAction={controller.removePhoto}
      />
    </AnimalForm>
  );
}
