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

export const OfferSort = {
  NEWEST: "newest",
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  DISTANCE: "distance",
} as const;
export type OfferSort = (typeof OfferSort)[keyof typeof OfferSort];

export const listOffersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().min(1).max(200).optional(),
    species: z.string().trim().min(1).max(50).optional(),
    breed: z.string().trim().min(1).max(100).optional(),
    sex: z.nativeEnum(AnimalSex).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    locationText: z.string().trim().min(1).max(200).optional(),
    radiusKm: z.coerce.number().positive().max(500).optional(),
    sort: z.nativeEnum(OfferSort).default(OfferSort.NEWEST),
  })
  .refine((data) => data.minPrice === undefined || data.maxPrice === undefined || data.minPrice <= data.maxPrice, {
    message: "Minimalna cena nie może być większa niż maksymalna",
    path: ["minPrice"],
  })
  .refine((data) => !data.radiusKm || (data.lat !== undefined && data.lng !== undefined) || data.locationText, {
    message: "Filtr odległości wymaga lokalizacji (współrzędnych albo nazwy miejsca)",
    path: ["radiusKm"],
  })
  .refine((data) => data.sort !== OfferSort.DISTANCE || data.radiusKm !== undefined, {
    message: "Sortowanie po odległości wymaga podania promienia wyszukiwania",
    path: ["sort"],
  });
export type ListOffersQuery = z.infer<typeof listOffersQuerySchema>;
