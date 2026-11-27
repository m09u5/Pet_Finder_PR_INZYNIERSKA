import { AuthGate } from "@/components/auth/auth-gate/AuthGate";
import { ReservationDetails } from "@/components/reservations/reservation-details/ReservationDetails";

export default async function ReservationPage({ params }: PageProps<"/reservations/[id]">) {
  const { id } = await params;

  return (
    <AuthGate requiredRole="CUSTOMER" message="Ta strona jest tylko dla klientów.">
      <ReservationDetails reservationId={id} />
    </AuthGate>
  );
}
