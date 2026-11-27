import type { User } from "@prisma/client";
import type { UserRole } from "@pet-finder/shared";

export interface NewBreederProfile {
  breedingName: string;
  description?: string;
  street: string;
  city: string;
  postalCode: string;
}

export interface NewUser {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  breederProfile?: NewBreederProfile;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: NewUser): Promise<User>;
}
