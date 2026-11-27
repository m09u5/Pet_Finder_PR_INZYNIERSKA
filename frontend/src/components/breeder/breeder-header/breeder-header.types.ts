import type { VerificationStatus } from "@pet-finder/shared";

export interface BreederHeaderProps {
  breedingName: string;
  verificationStatus: VerificationStatus;
  street: string;
  city: string;
  description: string | null;
  logoUrl: string | null;
  editable?: boolean;
}
