import type { ImageWithOwner } from "../../repositories/image.repository";
import { BadRequestError, ForbiddenError } from "../AppError";
import { detectImageType } from "../imageType";

export function assertHasFiles(files: Express.Multer.File[]) {
  if (files.length === 0) {
    throw new BadRequestError("Nie przesłano żadnego pliku", "NO_FILES");
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
