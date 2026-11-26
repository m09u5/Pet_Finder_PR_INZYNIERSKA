import { BreederVerification } from "@/components/admin/breeder-verification/BreederVerification";
import { AuthGate } from "@/components/auth/auth-gate/AuthGate";

export default function AdminPage() {
  return (
    <AuthGate requiredRole="ADMIN" message="Ta strona jest tylko dla administratorów.">
      <BreederVerification />
    </AuthGate>
  );
}
