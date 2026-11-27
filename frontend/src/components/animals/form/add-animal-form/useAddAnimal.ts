import { useState } from "react";
import { useInvalidateOffers } from "@/hooks/useInvalidateOffers";
import { apiUpload, ApiError } from "@/lib/api";
import type { UseAddAnimalResult } from "./add-animal-form.types";
import { useSelectedPhotos } from "@/components/animals/form/animal-photo-picker/useSelectedPhotos";
import { EMPTY_ANIMAL_FORM, toAnimalPayload } from "@/components/animals/form/shared/animal-form.utils";
import { useAnimalForm } from "@/components/animals/form/shared/useAnimalForm";

export function useAddAnimal(): UseAddAnimalResult {
  const invalidateOffers = useInvalidateOffers();
  const { form, setField, replaceForm } = useAnimalForm(EMPTY_ANIMAL_FORM);
  const { photos, photoError, addPhotos, removePhoto, clearPhotos } = useSelectedPhotos();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError(null);
    if (photos.length === 0) {
      setError("Dodaj co najmniej jedno zdjęcie zwierzęcia");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("animal", JSON.stringify(toAnimalPayload(form)));
      photos.forEach((photo) => formData.append("images", photo.file));
      await apiUpload("/api/offers", formData);
      await invalidateOffers();
      replaceForm(EMPTY_ANIMAL_FORM);
      clearPhotos();
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się dodać zwierzęcia");
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    setField,
    photos,
    addPhotos: (files) => {
      setError(null);
      addPhotos(files);
    },
    removePhoto,
    error: error ?? photoError,
    saving,
    submit,
    isOpen,
    open: () => setIsOpen(true),
    cancel: () => setIsOpen(false),
  };
}
