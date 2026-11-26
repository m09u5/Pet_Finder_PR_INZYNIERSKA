"use client";

import { useAuth } from "@/context/AuthContext";
import { buttonClass } from "@/styles/theme";
import { ReserveButton } from "@/components/animals/reserve-button/ReserveButton";
import type { AnimalActionsProps } from "./animal-actions.types";

export function AnimalActions({ animal, editable, onEditAction }: AnimalActionsProps) {
  const { user } = useAuth();
  const isCustomer = user?.role === "CUSTOMER";
  const isAvailable = animal.status === "AVAILABLE";

  return (
    <div className="mt-4">
      {editable && (
        <button type="button" onClick={onEditAction} className={buttonClass({ variant: "outline" })}>
          Edytuj
        </button>
      )}
      {!editable && !user && (
        <p className="text-sm text-gray-500">Zaloguj się, aby zarezerwować lub napisać do hodowcy.</p>
      )}
      {!editable && isCustomer && isAvailable && <ReserveButton animalId={animal.id} />}
      {!editable && isCustomer && !isAvailable && (
        <span className="inline-block px-4 py-2 rounded-full text-sm bg-gray-200 text-gray-600">
          {animal.status === "RESERVED" ? "Zarezerwowane" : "Niedostępne"}
        </span>
      )}
    </div>
  );
}
