import type { BreederProfile } from "@prisma/client";
import type { UserRole } from "@pet-finder/shared";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        email: string;
      };
      breederProfile?: BreederProfile;
    }
  }
}

export {};
