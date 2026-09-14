"use client";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <p className="p-6">Zaloguj się, aby zobaczyć profil.</p>;

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 border rounded">
      <h1 className="text-xl mb-4">Twój profil</h1>
      <p>
        {user.firstName} {user.lastName}
      </p>
      <p className="text-gray-500">{user.email}</p>
      <p className="text-sm mt-2">Rola: {user.role}</p>
      <p className="text-sm">E-mail zweryfikowany: {user.emailVerified ? "Tak" : "Nie"}</p>
    </div>
  );
}
