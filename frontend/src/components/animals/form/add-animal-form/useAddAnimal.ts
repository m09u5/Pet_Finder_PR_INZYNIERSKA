import { useState } from "react";
import { useInvalidateOffers } from "@/hooks/useInvalidateOffers";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseAddAnimalResult } from "./add-animal-form.types";
import { EMPTY_ANIMAL_FORM, toAnimalPayload } from "@/components/animals/form/shared/animal-form.utils";
import { useAnimalForm } from "@/components/animals/form/shared/useAnimalForm";

export function useAddAnimal(): UseAddAnimalResult {
  const invalidateOffers = useInvalidateOffers();
  const { form, setField, replaceForm } = useAnimalForm(EMPTY_ANIMAL_FORM);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError(null);
    setSaving(true);
    try {
      await apiFetch("/api/offers", {
        method: "POST",
        body: JSON.stringify({ animal: toAnimalPayload(form) }),
      });
      await invalidateOffers();
      replaceForm(EMPTY_ANIMAL_FORM);
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
    error,
    saving,
    submit,
    isOpen,
    open: () => setIsOpen(true),
    cancel: () => setIsOpen(false),
  };
}
