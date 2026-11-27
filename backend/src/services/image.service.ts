import { imageRepository, offerRepository } from "../config/repositories";
import type { StoredImage } from "../repositories/image.repository";
import { ANIMAL_AND_OFFER_IMAGES_FOLDER } from "../utils/storageFolders";
import { requireFound } from "../utils/validators/found.validators";
import {
  assertHasFiles,
  assertImageOwner,
  assertNotLastAnimalImage,
  requireImageType,
} from "../utils/validators/image.validators";
import { assertOfferOwner, requireAnimalInOffer } from "../utils/validators/offer.validators";
import { deleteImage as deleteStoredImage, uploadImage } from "./storage.service";

export async function addOfferImages(offerId: string, breederId: string, files: Express.Multer.File[]) {
  await getOwnedOffer(offerId, breederId);
  return saveFiles(files, { offerId });
}

export async function addAnimalImages(
  offerId: string,
  animalId: string,
  breederId: string,
  files: Express.Multer.File[],
) {
  const offer = await getOwnedOffer(offerId, breederId);
  requireAnimalInOffer(offer, animalId);
  return saveFiles(files, { animalId });
}

export async function deleteOwnedImage(imageId: string, breederId: string) {
  const image = requireFound(await imageRepository.findByIdWithOwner(imageId), "Zdjęcie nie istnieje");
  assertImageOwner(image, breederId);
  if (image.animalId) {
    assertNotLastAnimalImage(await imageRepository.countByAnimalId(image.animalId));
  }
  await deleteStoredImage(image.storagePath);
  await imageRepository.delete(imageId);
}

async function getOwnedOffer(offerId: string, breederId: string) {
  const offer = requireFound(await offerRepository.findById(offerId), "Ogłoszenie nie istnieje");
  assertOfferOwner(offer, breederId);
  return offer;
}

export async function saveWithStoredImages<T>(
  files: Express.Multer.File[],
  save: (images: StoredImage[]) => Promise<T>,
  folder: string = ANIMAL_AND_OFFER_IMAGES_FOLDER,
) {
  const checked = files.map((file) => ({ buffer: file.buffer, ...requireImageType(file) }));
  const stored: StoredImage[] = [];

  try {
    for (const { buffer, extension, mimeType } of checked) {
      stored.push(await uploadImage(buffer, extension, mimeType, folder));
    }
    return await save(stored);
  } catch (error) {
    await Promise.allSettled(stored.map((image) => deleteStoredImage(image.storagePath)));
    throw error;
  }
}

function saveFiles(files: Express.Multer.File[], target: { offerId?: string; animalId?: string }) {
  assertHasFiles(files);
  return saveWithStoredImages(files, (images) =>
    imageRepository.createMany(images.map((image) => ({ ...target, ...image }))),
  );
}
