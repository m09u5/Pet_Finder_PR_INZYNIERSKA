import type { BreederProfileWithOwner, VerificationStatus } from "@pet-finder/shared";

export type VerificationDecision = Exclude<VerificationStatus, "PENDING">;

export interface BreederVerificationCardProps {
  breeder: BreederProfileWithOwner;
  onDecisionAction: (decision: VerificationDecision) => void;
}
