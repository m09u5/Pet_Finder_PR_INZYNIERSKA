import { z } from "zod";
import { AnimalSex } from "./enums";

const animalFields = {
  name: z.string().trim().min(1, "Imię zwierzęcia jest wymagane").max(100),
  species: z.string().trim().min(1, "Gatunek jest wymagany").max(50),
  breed: z.string().trim().min(1, "Rasa jest wymagana").max(100),
  sex: z.nativeEnum(AnimalSex),
  birthDate: z.coerce.date(),
  description: z.string().trim().max(2000).optional(),
  motherName: z.string().trim().max(100).optional(),
  fatherName: z.string().trim().max(100).optional(),
  price: z.coerce.number().positive("Cena musi być dodatnia").max(1_000_000),
};

export const addAnimalSchema = z.object({
  animal: z.object(animalFields),
});
export type AddAnimalInput = z.infer<typeof addAnimalSchema>;

export const updateAnimalSchema = z.object({
  name: animalFields.name.optional(),
  species: animalFields.species.optional(),
  breed: animalFields.breed.optional(),
  sex: animalFields.sex.optional(),
  birthDate: animalFields.birthDate.optional(),
  description: animalFields.description,
  motherName: animalFields.motherName,
  fatherName: animalFields.fatherName,
  price: animalFields.price.optional(),
});
export type UpdateAnimalInput = z.infer<typeof updateAnimalSchema>;

export const listOffersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListOffersQuery = z.infer<typeof listOffersQuerySchema>;
