"use client";

import { BreederVerificationCard } from "@/components/admin/breeder-verification-card/BreederVerificationCard";
import { ToggleGroup } from "@/components/ui/toggle-group/ToggleGroup";
import { listClass, pageClass, pageTitleClass } from "@/styles/theme";
import { STATUS_OPTIONS } from "./breeder-verification.utils";
import { useBreederVerification } from "./useBreederVerification";

export function BreederVerification() {
  const { status, breeders, isLoading, setStatus, decide } = useBreederVerification();

  return (
    <div className={pageClass}>
      <h1 className={pageTitleClass}>Weryfikacja hodowców</h1>
      <ToggleGroup options={STATUS_OPTIONS} value={status} onChangeAction={setStatus} className="mb-4" />
      {isLoading ? (
        <p>Ładowanie...</p>
      ) : (
        <div className={listClass}>
          {breeders?.map((breeder) => (
            <BreederVerificationCard
              key={breeder.id}
              breeder={breeder}
              onDecisionAction={(decision) => decide(breeder.id, decision)}
            />
          ))}
          {breeders?.length === 0 && <p>Brak hodowców w tym statusie.</p>}
        </div>
      )}
    </div>
  );
}
