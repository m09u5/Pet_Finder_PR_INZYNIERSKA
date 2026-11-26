import type { AnimalDetailsProps } from "./animal-details.types";

export function AnimalDetails({ animal }: AnimalDetailsProps) {
  return (
    <>
      <h2 className="text-lg font-medium mt-4">{animal.name}</h2>
      {animal.description && <p className="text-gray-600 mt-1">{animal.description}</p>}
      <div className="mt-3 text-sm flex flex-col gap-1">
        <p>
          Gatunek / rasa: {animal.species} / {animal.breed}
        </p>
        <p>Płeć: {animal.sex === "FEMALE" ? "Samica" : "Samiec"}</p>
        <p>Data urodzenia: {new Date(animal.birthDate).toLocaleDateString("pl-PL")}</p>
      </div>
      <p className="text-xl mt-3">{animal.price} zł</p>
    </>
  );
}
