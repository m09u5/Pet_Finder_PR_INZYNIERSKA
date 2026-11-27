"use client";

import { buttonClass } from "@/styles/theme";
import { AnimalFormFields } from "@/components/animals/form/animal-form-fields/AnimalFormFields";
import type { AnimalFormProps } from "./animal-form.types";

export function AnimalForm({
  form,
  error,
  saving,
  submitLabel,
  onChangeAction,
  onSubmitAction,
  onCancelAction,
  children,
}: AnimalFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <AnimalFormFields form={form} onChangeAction={onChangeAction} />
      {children}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2 mt-1">
        <button type="button" onClick={onSubmitAction} disabled={saving} className={buttonClass()}>
          {saving ? "Zapisywanie..." : submitLabel}
        </button>
        <button type="button" onClick={onCancelAction} disabled={saving} className={buttonClass({ variant: "outline" })}>
          Anuluj
        </button>
      </div>
    </div>
  );
}
