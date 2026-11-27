import type { ListBreedersQuery, UpdateBreederProfileInput, UpdateVerificationStatusInput } from "@pet-finder/shared";
import { breederRepository } from "../config/repositories";
import { requireFound } from "../utils/validators/found.validators";

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
