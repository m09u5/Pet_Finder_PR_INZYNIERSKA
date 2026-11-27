import type { BreederProfile } from "@prisma/client";
import { ForbiddenError } from "../AppError";

export function requireVerifiedProfile(profile: BreederProfile | null): BreederProfile {
  if (!profile) {
    throw new ForbiddenError("Brak profilu hodowcy", "NOT_BREEDER");
  }
  if (profile.verificationStatus !== "VERIFIED") {
    throw new ForbiddenError("Hodowca nie jest zweryfikowany", "BREEDER_NOT_VERIFIED");
  }
  return profile;
}
