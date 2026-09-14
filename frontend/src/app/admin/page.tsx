"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BreederProfileWithOwner, VerificationStatus } from "@pet-finder/shared";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const STATUSES: VerificationStatus[] = ["PENDING", "VERIFIED", "REJECTED"];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<VerificationStatus>("PENDING");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-breeders", statusFilter],
    queryFn: () => apiFetch<{ items: BreederProfileWithOwner[] }>(`/api/admin/breeders?status=${statusFilter}`),
    enabled: !!user && user.role === "ADMIN",
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "VERIFIED" | "REJECTED" }) =>
      apiFetch(`/api/admin/breeders/${id}/verification`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-breeders"] }),
  });

  if (authLoading) return null;
  if (!user || user.role !== "ADMIN") return <p className="p-6">Ta strona jest tylko dla administratorów.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Weryfikacja hodowców</h1>
      <div className="flex gap-2 mb-4">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded border ${statusFilter === status ? "bg-black text-white" : ""}`}
          >
            {status}
          </button>
        ))}
      </div>
      {isLoading ? (
        <p>Ładowanie...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data?.items.map((breeder) => (
            <div key={breeder.id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{breeder.breedingName}</p>
                <p className="text-sm text-gray-500">
                  {breeder.owner.firstName} {breeder.owner.lastName} · {breeder.owner.email}
                </p>
              </div>
              {breeder.verificationStatus === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => mutation.mutate({ id: breeder.id, status: "VERIFIED" })}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Zweryfikuj
                  </button>
                  <button
                    onClick={() => mutation.mutate({ id: breeder.id, status: "REJECTED" })}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Odrzuć
                  </button>
                </div>
              )}
            </div>
          ))}
          {data?.items.length === 0 && <p>Brak hodowców w tym statusie.</p>}
        </div>
      )}
    </div>
  );
}
