"use client";

import { AnimalAttributeFields } from "@/components/animals/form/animal-attribute-fields/AnimalAttributeFields";
import { AnimalIdentityFields } from "@/components/animals/form/animal-identity-fields/AnimalIdentityFields";
import type { AnimalFieldsProps } from "@/components/animals/form/shared/animal-form-shared.types";

export function AnimalFormFields({ form, onChangeAction }: AnimalFieldsProps) {
  return (
    <div className="flex flex-col gap-2">
      <AnimalIdentityFields form={form} onChangeAction={onChangeAction} />
      <AnimalAttributeFields form={form} onChangeAction={onChangeAction} />
    </div>
  );
}
