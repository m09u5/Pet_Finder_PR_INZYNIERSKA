import type { AnimalSex, AnimalStatus, OfferStatus, VerificationStatus } from "./enums";

export interface PublicOfferBreeder {
  id: string;
  userId: string;
  breedingName: string;
  description: string | null;
  street: string;
  city: string;
  postalCode: string;
  verificationStatus: VerificationStatus;
}

export interface PublicImage {
  id: string;
  url: string;
}

export interface PublicAnimal {
  id: string;
  name: string;
  species: string;
  breed: string;
  sex: AnimalSex;
  birthDate: string;
  description: string | null;
  motherName: string | null;
  fatherName: string | null;
  price: number;
  status: AnimalStatus;
  images: PublicImage[];
}

export interface PublicOffer {
  id: string;
  breederId: string;
  title: string;
  description: string | null;
  status: OfferStatus;
  animals: PublicAnimal[];
  images: PublicImage[];
  breeder: PublicOfferBreeder;
  createdAt: string;
  updatedAt: string;
}
