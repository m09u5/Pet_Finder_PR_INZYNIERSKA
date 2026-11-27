import type { Animal, BreederProfile, Image, Offer } from "@prisma/client";
import type { AnimalSex, OfferStatus } from "@pet-finder/shared";
import type { Coordinates } from "./breeder.repository";
import type { StoredImage } from "./image.repository";

export type AnimalWithImages = Animal & { images: Image[] };

export type OfferWithRelations = Offer & {
  animals: AnimalWithImages[];
  images: Image[];
  breeder: Pick<
    BreederProfile,
    | "id"
    | "userId"
    | "breedingName"
    | "description"
    | "street"
    | "city"
    | "postalCode"
    | "latitude"
    | "longitude"
    | "verificationStatus"
  >;
};

export interface AnimalFields {
  name: string;
  species: string;
  breed: string;
  sex: AnimalSex;
  birthDate: Date;
  description?: string;
  motherName?: string;
  fatherName?: string;
  price: number;
}

export interface OfferSearchCriteria {
  keywords?: string;
  species?: string;
  breed?: string;
  sex?: AnimalSex;
  minPrice?: number;
  maxPrice?: number;
}

export interface BreederDistance {
  breederId: string;
  distanceKm: number;
}

export interface NewOffer {
  breederId: string;
  title: string;
  animal: AnimalFields;
  images: StoredImage[];
}

export interface OfferRepository {
  findById(id: string): Promise<OfferWithRelations | null>;
  findByBreederId(breederId: string): Promise<OfferWithRelations | null>;
  search(criteria: OfferSearchCriteria): Promise<OfferWithRelations[]>;
  getDistancesForBreeders(breederIds: string[], origin: Coordinates): Promise<BreederDistance[]>;
  createWithAnimal(offer: NewOffer): Promise<OfferWithRelations>;
  addAnimal(offerId: string, breederId: string, animal: AnimalFields, images: StoredImage[]): Promise<Animal>;
  updateAnimal(animalId: string, patch: Partial<AnimalFields>): Promise<Animal>;
  updateStatus(id: string, status: OfferStatus): Promise<OfferWithRelations>;
}
