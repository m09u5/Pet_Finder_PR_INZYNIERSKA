import { AuthGate } from "@/components/auth/auth-gate/AuthGate";
import { IncomingReservations } from "@/components/reservations/incoming-reservations/IncomingReservations";

export default function IncomingReservationsPage() {
  return (
    <AuthGate requiredRole="BREEDER" message="Ta strona jest tylko dla hodowców.">
      <IncomingReservations />
    </AuthGate>
  );
}
