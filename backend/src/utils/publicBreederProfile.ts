import type { BreederProfile, User } from "@prisma/client";
import type { BreederProfileWithOwner } from "@pet-finder/shared";

type BreederProfileWithUser = BreederProfile & {
  user: Pick<User, "id" | "email" | "firstName" | "lastName">;
};

export function toPublicBreederProfile(breeder: BreederProfileWithUser): BreederProfileWithOwner {
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
    owner: {
      id: breeder.user.id,
      email: breeder.user.email,
      firstName: breeder.user.firstName,
      lastName: breeder.user.lastName,
    },
  };
}
