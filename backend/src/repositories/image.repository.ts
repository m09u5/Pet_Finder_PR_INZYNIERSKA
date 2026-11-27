import type { Animal, Image, Offer } from "@prisma/client";

export type ImageWithOwner = Image & {
  offer: Offer | null;
  animal: (Animal & { offer: Offer }) | null;
};

export interface StoredImage {
  url: string;
  storagePath: string;
}

export interface NewImage extends StoredImage {
  offerId?: string;
  animalId?: string;
}

export interface ImageRepository {
  findByIdWithOwner(id: string): Promise<ImageWithOwner | null>;
  countByAnimalId(animalId: string): Promise<number>;
  createMany(images: NewImage[]): Promise<Image[]>;
  delete(id: string): Promise<void>;
}
