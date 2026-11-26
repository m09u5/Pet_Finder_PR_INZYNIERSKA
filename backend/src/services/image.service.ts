import { imageRepository, offerRepository } from "../config/repositories";
import { requireFound } from "../utils/validators/found.validators";
import { assertHasFiles, assertImageOwner, requireImageType } from "../utils/validators/image.validators";
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
  await deleteStoredImage(image.storagePath);
  await imageRepository.delete(imageId);
}

async function getOwnedOffer(offerId: string, breederId: string) {
  const offer = requireFound(await offerRepository.findById(offerId), "Ogłoszenie nie istnieje");
  assertOfferOwner(offer, breederId);
  return offer;
}

async function saveFiles(files: Express.Multer.File[], target: { offerId?: string; animalId?: string }) {
  assertHasFiles(files);

  const images = [];
  for (const file of files) {
    const { extension, mimeType } = requireImageType(file);
    const uploaded = await uploadImage(file.buffer, extension, mimeType);
    images.push(await imageRepository.create({ ...target, url: uploaded.url, storagePath: uploaded.storagePath }));
  }
  return images;
}
