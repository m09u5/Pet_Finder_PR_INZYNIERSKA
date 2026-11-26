import type { BreederProfileWithOwner, VerificationStatus } from "@pet-finder/shared";
import type { VerificationDecision } from "@/components/admin/breeder-verification-card/breeder-verification-card.types";

export interface UseBreederVerificationResult {
  status: VerificationStatus;
  breeders: BreederProfileWithOwner[] | undefined;
  isLoading: boolean;
  setStatus: (status: VerificationStatus) => void;
  decide: (id: string, decision: VerificationDecision) => void;
}
