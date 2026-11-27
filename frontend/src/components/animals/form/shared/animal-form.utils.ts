import type { PublicAnimal } from "@pet-finder/shared";
import type { AnimalFormState } from "./animal-form-shared.types";

export const EMPTY_ANIMAL_FORM: AnimalFormState = {
  description: "",
  price: "",
  name: "",
  species: "",
  breed: "",
  sex: "FEMALE",
  birthDate: "",
  motherName: "",
  fatherName: "",
};

export function toAnimalFormState(animal: PublicAnimal): AnimalFormState {
  return {
    description: animal.description ?? "",
    price: String(animal.price),
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    sex: animal.sex,
    birthDate: animal.birthDate.slice(0, 10),
    motherName: animal.motherName ?? "",
    fatherName: animal.fatherName ?? "",
  };
}

export function toAnimalPayload(form: AnimalFormState) {
  return {
    name: form.name,
    species: form.species,
    breed: form.breed,
    sex: form.sex,
    birthDate: form.birthDate,
    description: form.description || undefined,
    motherName: form.motherName,
    fatherName: form.fatherName,
    price: Number(form.price),
  };
}
