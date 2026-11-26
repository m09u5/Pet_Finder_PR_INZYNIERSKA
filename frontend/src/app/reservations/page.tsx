import { AuthGate } from "@/components/auth/auth-gate/AuthGate";
import { CustomerReservations } from "@/components/reservations/customer-reservations/CustomerReservations";

export default function MyReservationsPage() {
  return (
    <AuthGate requiredRole="CUSTOMER" message="Ta strona jest tylko dla klientów.">
      <CustomerReservations />
    </AuthGate>
  );
}
