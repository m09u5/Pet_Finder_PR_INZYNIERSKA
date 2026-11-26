import type { BreederProfile } from "@prisma/client";
import type { BreederProfileWithOwner, PublicBreederProfile } from "@pet-finder/shared";
import type { BreederProfileWithUser } from "../repositories/breeder.repository";

export function toPublicBreederProfile(breeder: BreederProfile): PublicBreederProfile {
  return {
    id: breeder.id,
    userId: breeder.userId,
    breedingName: breeder.breedingName,
    description: breeder.description,
    verificationStatus: breeder.verificationStatus,
    street: breeder.street,
    city: breeder.city,
    postalCode: breeder.postalCode,
    latitude: breeder.latitude,
    longitude: breeder.longitude,
    createdAt: breeder.createdAt.toISOString(),
  };
}

export function toBreederProfileWithOwner(breeder: BreederProfileWithUser): BreederProfileWithOwner {
  return {
    ...toPublicBreederProfile(breeder),
    owner: {
      id: breeder.user.id,
      email: breeder.user.email,
      firstName: breeder.user.firstName,
      lastName: breeder.user.lastName,
    },
  };
}
