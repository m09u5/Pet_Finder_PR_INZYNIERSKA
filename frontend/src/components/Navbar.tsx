"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="flex items-center gap-4 p-4 border-b text-sm">
      <Link href="/" className="font-medium">
        Pet Finder
      </Link>
      <Link href="/offers">Ogłoszenia</Link>
      {!loading && user?.role === "CUSTOMER" && <Link href="/reservations">Moje rezerwacje</Link>}
      {!loading && user?.role === "BREEDER" && <Link href="/breeder/offers">Moja hodowla</Link>}
      {!loading && user?.role === "BREEDER" && <Link href="/breeder/reservations">Rezerwacje</Link>}
      {!loading && user?.role === "ADMIN" && <Link href="/admin">Panel admina</Link>}
      <div className="ml-auto flex items-center gap-3">
        {loading ? null : user ? (
          <>
            <Link href="/profile">{user.email}</Link>
            <button onClick={logout} className="border px-3 py-1 rounded">
              Wyloguj
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Zaloguj</Link>
            <Link href="/register">Zarejestruj</Link>
          </>
        )}
      </div>
    </nav>
  );
}
