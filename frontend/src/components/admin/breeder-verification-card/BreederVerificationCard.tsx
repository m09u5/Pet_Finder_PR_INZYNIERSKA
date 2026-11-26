import { buttonClass, listCardClass, mutedTextClass } from "@/styles/theme";
import type { BreederVerificationCardProps } from "./breeder-verification-card.types";

export function BreederVerificationCard({ breeder, onDecisionAction }: BreederVerificationCardProps) {
  return (
    <div className={listCardClass}>
      <div>
        <p className="font-medium">{breeder.breedingName}</p>
        <p className={mutedTextClass}>
          {breeder.owner.firstName} {breeder.owner.lastName} · {breeder.owner.email}
        </p>
      </div>
      {breeder.verificationStatus === "PENDING" && (
        <div className="flex gap-2">
          <button type="button" onClick={() => onDecisionAction("VERIFIED")} className={buttonClass({ size: "sm" })}>
            Zweryfikuj
          </button>
          <button
            type="button"
            onClick={() => onDecisionAction("REJECTED")}
            className={buttonClass({ variant: "danger", size: "sm" })}
          >
            Odrzuć
          </button>
        </div>
      )}
    </div>
  );
}
