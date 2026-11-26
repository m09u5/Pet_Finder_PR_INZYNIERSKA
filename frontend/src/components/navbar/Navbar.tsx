"use client";

import Link from "next/link";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { PersonIcon } from "@/components/ui/icons/PersonIcon";
import { buttonClass, containerClass, navLinkClass, surfaceBarClass } from "@/styles/theme";
import { SearchBar } from "@/components/navbar/search-bar/SearchBar";

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className={surfaceBarClass}>
      <div className={clsx(containerClass, "py-3 flex flex-wrap items-center gap-3")}>
        <Link href="/" className="font-semibold text-lg text-gray-900 whitespace-nowrap">
          Pet Finder
        </Link>

        <SearchBar />

        <div className="ml-auto flex items-center gap-4 whitespace-nowrap text-sm">
          {loading ? null : user ? (
            <>
              {(user.role === "CUSTOMER" || user.role === "BREEDER") && (
                <Link href="/messages" className={navLinkClass}>
                  Wiadomości
                </Link>
              )}
              {user.role === "CUSTOMER" && (
                <Link href="/reservations" className={navLinkClass}>
                  Moje rezerwacje
                </Link>
              )}
              {user.role === "BREEDER" && (
                <Link href="/breeder/reservations" className={navLinkClass}>
                  Rezerwacje
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link href="/admin" className={navLinkClass}>
                  Panel admina
                </Link>
              )}
              <Link href="/profile" className={clsx(navLinkClass, "flex items-center gap-1.5")}>
                <PersonIcon />
                Moje konto
              </Link>
              <button onClick={logout} className={buttonClass({ variant: "outline", size: "sm" })}>
                Wyloguj
              </button>
              {user.role === "BREEDER" && (
                <Link href="/breeder/offers" className={buttonClass()}>
                  Moja hodowla
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className={clsx(navLinkClass, "flex items-center gap-1.5")}>
                <PersonIcon />
                Logowanie/Rejestracja
              </Link>
              <Link href="/register" className={buttonClass()}>
                Zostań Hodowcą
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
