import type { ListBreedersQuery, UpdateVerificationStatusInput } from "@pet-finder/shared";
import { breederRepository } from "../repositories/breeder.repository";
import { NotFoundError } from "../utils/AppError";

export async function listBreedersForAdmin(query: ListBreedersQuery) {
  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    breederRepository.list({ status: query.status, skip, take: query.limit }),
    breederRepository.count(query.status),
  ]);
  return { items, total, page: query.page, limit: query.limit };
}

export async function setBreederVerificationStatus(breederId: string, input: UpdateVerificationStatusInput) {
  const breeder = await breederRepository.findById(breederId);
  if (!breeder) {
    throw new NotFoundError("Profil hodowcy nie istnieje");
  }
  return breederRepository.updateVerificationStatus(breederId, input.status);
}
