"use client";

import clsx from "clsx";
import { AddAnimalForm } from "@/components/animals/form/add-animal-form/AddAnimalForm";
import { BreederHeader } from "@/components/breeder/breeder-header/BreederHeader";
import { OfferView } from "@/components/offers/offer-view/OfferView";
import { narrowPageClass, pageClass } from "@/styles/theme";
import { useBreederDashboard } from "./useBreederDashboard";

export function BreederDashboard() {
  const { breeder, offer, isLoading } = useBreederDashboard();

  if (isLoading) return <p className={pageClass}>Ładowanie...</p>;
  if (!breeder) return null;

  if (offer) {
    return (
      <div className={clsx(narrowPageClass, "w-full")}>
        <OfferView offer={offer} isOwner />
      </div>
    );
  }

  return (
    <div className={clsx(narrowPageClass, "w-full")}>
      <BreederHeader
        breedingName={breeder.breedingName}
        verificationStatus={breeder.verificationStatus}
        street={breeder.street}
        city={breeder.city}
        postalCode={breeder.postalCode}
        description={breeder.description}
        editable
      />
      <div className="border-t border-gray-200 pt-6">
        <p className="text-gray-500 mb-3">Nie masz jeszcze żadnych zwierząt w hodowli.</p>
        <AddAnimalForm />
      </div>
    </div>
  );
}
