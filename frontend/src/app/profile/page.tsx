import { AuthGate } from "@/components/auth/auth-gate/AuthGate";
import { ProfileView } from "@/components/profile/profile-view/ProfileView";

export default function ProfilePage() {
  return (
    <AuthGate message="Zaloguj się, aby zobaczyć profil.">
      <ProfileView />
    </AuthGate>
  );
}
