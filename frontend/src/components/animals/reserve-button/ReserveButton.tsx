"use client";

import { buttonClass } from "@/styles/theme";
import type { ReserveButtonProps } from "./reserve-button.types";
import { useReserveAnimal } from "./useReserveAnimal";

export function ReserveButton({ animalId }: ReserveButtonProps) {
  const { reserve, reserving, error } = useReserveAnimal(animalId);

  return (
    <div>
      <button type="button" onClick={reserve} disabled={reserving} className={buttonClass()}>
        {reserving ? "Rezerwowanie..." : "Zarezerwuj"}
      </button>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
