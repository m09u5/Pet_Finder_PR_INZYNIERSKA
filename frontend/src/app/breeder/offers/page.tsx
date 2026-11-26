import { AuthGate } from "@/components/auth/auth-gate/AuthGate";
import { BreederDashboard } from "@/components/breeder/breeder-dashboard/BreederDashboard";

export default function MyBreederDashboardPage() {
  return (
    <AuthGate requiredRole="BREEDER" message="Ta strona jest tylko dla hodowców.">
      <BreederDashboard />
    </AuthGate>
  );
}
