import type { PublicAnimal, PublicImage } from "@pet-finder/shared";

const PLACEHOLDER_IMAGE: PublicImage = { id: "placeholder", url: "/placeholder-pet.jpeg" };

const ANIMALS_HEADINGS: { species: string[]; heading: string }[] = [
  { species: ["cat", "kot"], heading: "nasze kotki" },
  { species: ["dog", "pies"], heading: "nasze pieski" },
  { species: ["rabbit", "królik"], heading: "nasze króliczki" },
];

export function getAnimalsHeading(animals: PublicAnimal[]) {
  const species = animals.at(0)?.species.toLowerCase() ?? "";
  return ANIMALS_HEADINGS.find((entry) => entry.species.includes(species))?.heading ?? "nasze zwierzaki";
}

export function getMainGallery(offerImages: PublicImage[] = [PLACEHOLDER_IMAGE], animals: PublicAnimal[] = []) {
  const hasOwnImages = offerImages.some((image) => image.id !== PLACEHOLDER_IMAGE.id);
  const animalImages = animals.flatMap((animal) => animal.images).filter((image) => image.id !== PLACEHOLDER_IMAGE.id);

  return hasOwnImages || animalImages.length === 0
    ? { images: offerImages, isOwnGallery: true }
    : { images: animalImages, isOwnGallery: false };
}
