import type { UserRole, VerificationStatus } from "./enums";

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  emailVerified: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface PublicBreederProfile {
  id: string;
  userId: string;
  breedingName: string;
  description: string | null;
  verificationStatus: VerificationStatus;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface BreederProfileWithOwner extends PublicBreederProfile {
  owner: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}
