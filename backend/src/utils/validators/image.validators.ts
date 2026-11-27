import type { ImageWithOwner } from "../../repositories/image.repository";
import { BadRequestError, ForbiddenError } from "../AppError";
import { detectImageType } from "../imageType";

export function assertHasFiles(files: Express.Multer.File[], message = "Nie przesłano żadnego pliku") {
  if (files.length === 0) {
    throw new BadRequestError(message, "NO_FILES");
  }
}

export function assertNotLastAnimalImage(imageCount: number) {
  if (imageCount <= 1) {
    throw new BadRequestError("Zwierzę musi mieć co najmniej jedno zdjęcie", "LAST_ANIMAL_IMAGE");
  }
}

export function requireImageType(file: Express.Multer.File) {
  const detected = detectImageType(file.buffer);
  if (!detected) {
    throw new BadRequestError(
      `Plik "${file.originalname}" nie jest obsługiwanym obrazem (JPEG, PNG, WEBP lub GIF)`,
      "INVALID_FILE_TYPE",
    );
  }
  return detected;
}

export function assertImageOwner(image: ImageWithOwner, breederId: string) {
  const ownerBreederId = image.offer?.breederId ?? image.animal?.offer.breederId;
  if (ownerBreederId !== breederId) {
    throw new ForbiddenError("To nie jest Twoje zdjęcie", "NOT_OWNER");
  }
}
