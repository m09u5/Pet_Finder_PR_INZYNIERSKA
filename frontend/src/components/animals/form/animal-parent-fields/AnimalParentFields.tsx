"use client";

import clsx from "clsx";
import { fieldClass } from "@/styles/theme";
import type { AnimalFieldsProps } from "@/components/animals/form/shared/animal-form-shared.types";

export function AnimalParentFields({ form, onChangeAction }: AnimalFieldsProps) {
  return (
    <div className="flex gap-2">
      <input
        value={form.motherName}
        onChange={(event) => onChangeAction("motherName", event.target.value)}
        className={clsx(fieldClass, "flex-1 min-w-0")}
        placeholder="Imię matki (opcjonalnie)"
        maxLength={100}
      />
      <input
        value={form.fatherName}
        onChange={(event) => onChangeAction("fatherName", event.target.value)}
        className={clsx(fieldClass, "flex-1 min-w-0")}
        placeholder="Imię ojca (opcjonalnie)"
        maxLength={100}
      />
    </div>
  );
}
