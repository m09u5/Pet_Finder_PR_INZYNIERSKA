"use client";

import { IconButton } from "@/components/ui/icon-button/IconButton";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { whiteBoxClass } from "@/styles/theme";
import { AnimalForm } from "@/components/animals/form/animal-form/AnimalForm";
import { AnimalPhotoPicker } from "@/components/animals/form/animal-photo-picker/AnimalPhotoPicker";
import { useAddAnimal } from "./useAddAnimal";

export function AddAnimalForm() {
  const controller = useAddAnimal();

  if (!controller.isOpen) {
    return (
      <IconButton label="Dodaj zwierzę" className="self-center w-12 h-12" onClickAction={controller.open}>
        <PlusIcon />
      </IconButton>
    );
  }

  return (
    <div className={whiteBoxClass}>
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
    </div>
  );
}
