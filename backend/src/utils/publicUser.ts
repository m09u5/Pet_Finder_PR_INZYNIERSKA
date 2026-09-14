import type { User } from "@prisma/client";
import type { PublicUser } from "@pet-finder/shared";

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    emailVerified: user.emailVerified,
    latitude: user.latitude,
    longitude: user.longitude,
    createdAt: user.createdAt.toISOString(),
  };
}
