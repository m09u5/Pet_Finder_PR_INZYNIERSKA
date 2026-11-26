import type { BreederProfile, User } from "@prisma/client";
import type { VerificationStatus } from "@pet-finder/shared";

export type BreederProfileWithUser = BreederProfile & {
  user: Pick<User, "id" | "email" | "firstName" | "lastName">;
};

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BreederListParams {
  status?: VerificationStatus;
  skip: number;
  take: number;
}

export interface BreederRepository {
  list(params: BreederListParams): Promise<BreederProfileWithUser[]>;
  count(status?: VerificationStatus): Promise<number>;
  findById(id: string): Promise<BreederProfile | null>;
  findByUserId(userId: string): Promise<BreederProfile | null>;
  updateVerificationStatus(id: string, status: VerificationStatus): Promise<BreederProfileWithUser>;
  updateProfile(id: string, data: { description?: string }): Promise<BreederProfile>;
  updateCoordinates(userId: string, coordinates: Coordinates): Promise<BreederProfile>;
}
