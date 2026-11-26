"use client";

import clsx from "clsx";
import type { AnimalSex } from "@pet-finder/shared";
import { fieldClass } from "@/styles/theme";
import type { AnimalFieldsProps } from "@/components/animals/form/shared/animal-form-shared.types";

export function AnimalAttributeFields({ form, onChangeAction }: AnimalFieldsProps) {
  return (
    <>
      <div className="flex gap-2">
        <select
          value={form.sex}
          onChange={(event) => onChangeAction("sex", event.target.value as AnimalSex)}
          className={clsx(fieldClass, "flex-1 min-w-0")}
        >
          <option value="FEMALE">Samica</option>
          <option value="MALE">Samiec</option>
        </select>
        <input
          type="date"
          value={form.birthDate}
          onChange={(event) => onChangeAction("birthDate", event.target.value)}
          className={clsx(fieldClass, "flex-1 min-w-0")}
        />
      </div>
      <input
        type="number"
        value={form.price}
        onChange={(event) => onChangeAction("price", event.target.value)}
        className={clsx(fieldClass, "text-xl")}
        placeholder="Cena"
      />
    </>
  );
}
