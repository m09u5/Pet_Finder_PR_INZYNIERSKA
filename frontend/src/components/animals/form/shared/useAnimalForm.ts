import { useState } from "react";
import type { AnimalFormChangeHandler, AnimalFormState, UseAnimalFormResult } from "./animal-form-shared.types";

export function useAnimalForm(initialForm: AnimalFormState | (() => AnimalFormState)): UseAnimalFormResult {
  const [form, setForm] = useState<AnimalFormState>(initialForm);

  const setField: AnimalFormChangeHandler = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return { form, setField, replaceForm: setForm };
}
