"use client";

import { useAuth } from "@/context/AuthContext";
import { ReserveButton } from "@/components/animals/reserve-button/ReserveButton";
import type { AnimalActionsProps } from "./animal-actions.types";

export function AnimalActions({ animal }: AnimalActionsProps) {
  const { user } = useAuth();
  const isCustomer = user?.role === "CUSTOMER";
  const isAvailable = animal.status === "AVAILABLE";

  return (
    <div>
      {!user && <p className="text-sm text-gray-500">Zaloguj się, aby zarezerwować lub napisać do hodowcy.</p>}
      {isCustomer && isAvailable && <ReserveButton animalId={animal.id} />}
      {isCustomer && !isAvailable && (
        <span className="inline-block px-4 py-2 rounded-full text-sm bg-gray-200 text-gray-600">
          {animal.status === "RESERVED" ? "Rezerwacja w toku" : "Sprzedane"}
        </span>
      )}
    </div>
  );
}
