import type { Animal, Image, Offer } from "@prisma/client";

export type ImageWithOwner = Image & {
  offer: Offer | null;
  animal: (Animal & { offer: Offer }) | null;
};

export interface NewImage {
  offerId?: string;
  animalId?: string;
  url: string;
  storagePath: string;
}

export interface ImageRepository {
  findByIdWithOwner(id: string): Promise<ImageWithOwner | null>;
  create(image: NewImage): Promise<Image>;
  delete(id: string): Promise<void>;
}
