import { prisma } from "../config/prisma";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/AppError";
import { detectImageType } from "../utils/imageType";
import { deleteImage as deleteStoredImage, uploadImage } from "./storage.service";

async function assertOwnsOffer(offerId: string, breederId: string) {
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) {
    throw new NotFoundError("Ogłoszenie nie istnieje");
  }
  if (offer.breederId !== breederId) {
    throw new ForbiddenError("To nie jest Twoje ogłoszenie", "NOT_OWNER");
  }
}

async function saveFiles(files: Express.Multer.File[], target: { offerId?: string; animalId?: string }) {
  if (!files || files.length === 0) {
    throw new BadRequestError("Nie przesłano żadnego pliku", "NO_FILES");
  }

  const images = [];
  for (const file of files) {
    const detected = detectImageType(file.buffer);
    if (!detected) {
      throw new BadRequestError(
        `Plik "${file.originalname}" nie jest obsługiwanym obrazem (JPEG, PNG, WEBP lub GIF)`,
        "INVALID_FILE_TYPE",
      );
    }
    const uploaded = await uploadImage(file.buffer, detected.extension, detected.mimeType);
    const image = await prisma.image.create({
      data: { ...target, url: uploaded.url, storagePath: uploaded.storagePath },
    });
    images.push(image);
  }
  return images;
}

export async function addOfferImages(offerId: string, breederId: string, files: Express.Multer.File[]) {
  await assertOwnsOffer(offerId, breederId);
  return saveFiles(files, { offerId });
}

export async function addAnimalImages(
  offerId: string,
  animalId: string,
  breederId: string,
  files: Express.Multer.File[],
) {
  await assertOwnsOffer(offerId, breederId);
  const animal = await prisma.animal.findUnique({ where: { id: animalId } });
  if (!animal || animal.offerId !== offerId) {
    throw new NotFoundError("Zwierzę nie istnieje w tym ogłoszeniu");
  }
  return saveFiles(files, { animalId });
}

export async function deleteOwnedImage(imageId: string, breederId: string) {
  const image = await prisma.image.findUnique({
    where: { id: imageId },
    include: { offer: true, animal: { include: { offer: true } } },
  });
  if (!image) {
    throw new NotFoundError("Zdjęcie nie istnieje");
  }
  const ownerBreederId = image.offer?.breederId ?? image.animal?.offer.breederId;
  if (ownerBreederId !== breederId) {
    throw new ForbiddenError("To nie jest Twoje zdjęcie", "NOT_OWNER");
  }
  await deleteStoredImage(image.storagePath);
  await prisma.image.delete({ where: { id: imageId } });
}
