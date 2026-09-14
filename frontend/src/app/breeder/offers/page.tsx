"use client";

import { useQuery } from "@tanstack/react-query";
import type { PublicBreederProfile, PublicOffer } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { BreederHeader } from "@/components/BreederHeader";
import { OfferView } from "@/components/OfferView";
import { AddAnimalForm } from "@/components/AddAnimalForm";

export default function MyBreederDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const isBreeder = !!user && user.role === "BREEDER";

  const { data: breederData, isLoading: breederLoading } = useQuery({
    queryKey: ["my-breeder-profile"],
    queryFn: () => apiFetch<{ breeder: PublicBreederProfile }>("/api/breeders/me"),
    enabled: isBreeder,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["my-offer"],
    queryFn: () => apiFetch<{ offer: PublicOffer | null }>("/api/offers/mine"),
    enabled: isBreeder,
  });

  if (authLoading) return null;
  if (!user || user.role !== "BREEDER") return <p className="p-6">Ta strona jest tylko dla hodowców.</p>;
  if (breederLoading || isLoading) return <p className="p-6">Ładowanie...</p>;
  if (!breederData) return null;

  if (data?.offer) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <OfferView offer={data.offer} isOwner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <BreederHeader
        breedingName={breederData.breeder.breedingName}
        verificationStatus={breederData.breeder.verificationStatus}
        street={breederData.breeder.street}
        city={breederData.breeder.city}
        postalCode={breederData.breeder.postalCode}
        description={breederData.breeder.description}
        editable
      />
      <div className="border-t pt-6">
        <p className="text-gray-500 mb-3">Nie masz jeszcze żadnych zwierząt w hodowli.</p>
        <AddAnimalForm />
      </div>
    </div>
  );
}
