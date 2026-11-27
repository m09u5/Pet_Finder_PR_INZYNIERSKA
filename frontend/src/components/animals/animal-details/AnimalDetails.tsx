import clsx from "clsx";
import { whiteBoxClass } from "@/styles/theme";
import type { AnimalDetailsProps } from "./animal-details.types";

export function AnimalDetails({ animal, headerAction, children }: AnimalDetailsProps) {
  const parents = [animal.motherName, animal.fatherName].filter(Boolean).join(" i ");

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="flex items-center gap-3">
        <h3 className="min-w-0 bg-gray-200 rounded-2xl px-10 py-3 text-2xl break-words">{animal.name}</h3>
        {headerAction}
      </div>

      <div className={clsx(whiteBoxClass, "flex-1 flex flex-col gap-4 text-sm")}>
        {animal.description && <p className="whitespace-pre-line">{animal.description}</p>}

        {parents && (
          <p>
            Imiona rodziców:
            <br />
            {parents}
          </p>
        )}

        <p className="text-gray-600">
          {animal.species} / {animal.breed} · {animal.sex === "FEMALE" ? "samica" : "samiec"} · ur.{" "}
          {new Date(animal.birthDate).toLocaleDateString("pl-PL")}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <p className="text-xl">{animal.price} zł</p>
          {children}
        </div>
      </div>
    </div>
  );
}
