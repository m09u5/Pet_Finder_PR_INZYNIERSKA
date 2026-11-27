import type { ListBreedersQuery, UpdateBreederProfileInput, UpdateVerificationStatusInput } from "@pet-finder/shared";
import type { BreederProfile } from "@prisma/client";
import { breederRepository } from "../config/repositories";
import { breederLogoFolder } from "../utils/storageFolders";
import { requireFound } from "../utils/validators/found.validators";
import { assertHasFiles } from "../utils/validators/image.validators";
import { saveWithStoredImages } from "./image.service";
import { deleteImage as deleteStoredImage } from "./storage.service";

export async function listBreedersForAdmin(query: ListBreedersQuery) {
  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    breederRepository.list({ status: query.status, skip, take: query.limit }),
    breederRepository.count(query.status),
  ]);
  return { items, total, page: query.page, limit: query.limit };
}

export async function setBreederVerificationStatus(breederId: string, input: UpdateVerificationStatusInput) {
  requireFound(await breederRepository.findById(breederId), "Profil hodowcy nie istnieje");
  return breederRepository.updateVerificationStatus(breederId, input.status);
}

export function updateBreederProfile(breederId: string, input: UpdateBreederProfileInput) {
  return breederRepository.updateProfile(breederId, input);
}

export async function replaceBreederLogo(breeder: BreederProfile, files: Express.Multer.File[]) {
  assertHasFiles(files);
  const updated = await saveWithStoredImages(
    files,
    ([logo]) => breederRepository.updateLogo(breeder.id, logo),
    breederLogoFolder(breeder.id),
  );
  await removeStoredLogo(breeder);
  return updated;
}

export async function removeBreederLogo(breeder: BreederProfile) {
  const updated = await breederRepository.updateLogo(breeder.id, null);
  await removeStoredLogo(breeder);
  return updated;
}

async function removeStoredLogo(breeder: BreederProfile) {
  if (breeder.logoStoragePath) {
    await deleteStoredImage(breeder.logoStoragePath);
  }
}
