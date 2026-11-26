import { useState } from "react";
import type { PublicAnimal } from "@pet-finder/shared";
import { useInvalidateOffers } from "@/hooks/useInvalidateOffers";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseEditAnimalResult } from "./animal-list-item.types";
import { toAnimalFormState, toAnimalPayload } from "@/components/animals/form/shared/animal-form.utils";
import { useAnimalForm } from "@/components/animals/form/shared/useAnimalForm";

export function useEditAnimal(offerId: string, animal: PublicAnimal): UseEditAnimalResult {
  const invalidateOffers = useInvalidateOffers();
  const { form, setField, replaceForm } = useAnimalForm(() => toAnimalFormState(animal));
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    replaceForm(toAnimalFormState(animal));
    setError(null);
    setIsEditing(true);
  }

  async function submit() {
    setError(null);
    setSaving(true);
    try {
      await apiFetch(`/api/offers/${offerId}/animals/${animal.id}`, {
        method: "PUT",
        body: JSON.stringify(toAnimalPayload(form)),
      });
      await invalidateOffers();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się zapisać zmian");
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    setField,
    error,
    saving,
    submit,
    isEditing,
    startEditing,
    cancel: () => setIsEditing(false),
  };
}
