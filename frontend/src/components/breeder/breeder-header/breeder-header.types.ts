import type { VerificationStatus } from "@pet-finder/shared";

export interface BreederHeaderProps {
  breedingName: string;
  verificationStatus: VerificationStatus;
  street: string;
  city: string;
  postalCode: string;
  description: string | null;
  editable?: boolean;
}
