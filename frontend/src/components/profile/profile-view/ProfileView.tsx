"use client";

import { useAuth } from "@/context/AuthContext";
import { mutedTextClass, pageTitleClass, panelClass } from "@/styles/theme";

export function ProfileView() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={panelClass}>
      <h1 className={pageTitleClass}>Twój profil</h1>
      <p>
        {user.firstName} {user.lastName}
      </p>
      <p className={mutedTextClass}>{user.email}</p>
      <p className="text-sm mt-2">Rola: {user.role}</p>
      <p className="text-sm">E-mail zweryfikowany: {user.emailVerified ? "Tak" : "Nie"}</p>
    </div>
  );
}
