import type { Animal, BreederProfile, Image, Offer } from "@prisma/client";
import type { PublicImage, PublicOffer } from "@pet-finder/shared";

const PLACEHOLDER_IMAGE_URL = "/placeholder-pet.jpeg";

type AnimalWithImages = Animal & { images: Image[] };

type OfferWithRelations = Offer & {
  animals: AnimalWithImages[];
  images: Image[];
  breeder: Pick<
    BreederProfile,
    "id" | "userId" | "breedingName" | "description" | "street" | "city" | "postalCode" | "verificationStatus"
  >;
};

function toPublicImages(images: Image[]): PublicImage[] {
  return images.length > 0
    ? images.map((image) => ({ id: image.id, url: image.url }))
    : [{ id: "placeholder", url: PLACEHOLDER_IMAGE_URL }];
}

export function toPublicOffer(offer: OfferWithRelations): PublicOffer {
  return {
    id: offer.id,
    breederId: offer.breederId,
    title: offer.title,
    description: offer.description,
    status: offer.status,
    animals: offer.animals.map((animal) => ({
      id: animal.id,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      sex: animal.sex,
      birthDate: animal.birthDate.toISOString(),
      description: animal.description,
      motherName: animal.motherName,
      fatherName: animal.fatherName,
      price: animal.price.toNumber(),
      status: animal.status,
      images: toPublicImages(animal.images),
    })),
    images: toPublicImages(offer.images),
    breeder: {
      id: offer.breeder.id,
      userId: offer.breeder.userId,
      breedingName: offer.breeder.breedingName,
      description: offer.breeder.description,
      street: offer.breeder.street,
      city: offer.breeder.city,
      postalCode: offer.breeder.postalCode,
      verificationStatus: offer.breeder.verificationStatus,
    },
    createdAt: offer.createdAt.toISOString(),
    updatedAt: offer.updatedAt.toISOString(),
  };
}
