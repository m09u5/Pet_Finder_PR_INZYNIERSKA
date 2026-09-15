"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PublicReservation } from "@pet-finder/shared";
import { apiFetch} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const STATUS_LABELS: Record<PublicReservation["status"], string> = {
  PENDING: "Oczekująca",
  CONFIRMED: "Potwierdzona",
  CANCELLED: "Anulowana",
};

export default function MyReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-reservations"],
    queryFn: () => apiFetch<{ reservations: PublicReservation[] }>("/api/reservations/mine"),
    enabled: !!user && user.role === "CUSTOMER",
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/reservations/${id}/cancel`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-reservations"] }),
  });

  if (authLoading) return null;
  if (!user || user.role !== "CUSTOMER") return <p className="p-6">Ta strona jest tylko dla klientów.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Moje rezerwacje</h1>
      {isLoading && <p>Ładowanie...</p>}
      {error && <p className="text-red-600">Nie udało się pobrać rezerwacji.</p>}
      {!isLoading && !error && !data?.reservations.length && <p>Nie masz jeszcze żadnych rezerwacji.</p>}

      <div className="flex flex-col gap-2">
        {data?.reservations.map((reservation) => (
          <div key={reservation.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <Link href={`/offers/${reservation.offer.id}`} className="font-medium hover:underline">
                {reservation.animal.name} — {reservation.animal.breed}
              </Link>
              <p className="text-sm text-gray-500">
                {reservation.offer.breedingName} · {reservation.animal.price} zł
              </p>
              <p className="text-sm text-gray-500">
                Utworzono: {new Date(reservation.createdAt).toLocaleDateString("pl-PL")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-900">
                {STATUS_LABELS[reservation.status]}
              </span>
              {reservation.status === "PENDING" && (
                <button
                  onClick={() => cancelMutation.mutate(reservation.id)}
                  disabled={cancelMutation.isPending}
                  className="border px-3 py-1 rounded disabled:opacity-50"
                >
                  Anuluj
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {cancelMutation.isError && (
        <p className="text-red-600 text-sm mt-2">
          { cancelMutation.error.message && "Nie udało się anulować rezerwacji"}
        </p>
      )}
    </div>
  );
}
