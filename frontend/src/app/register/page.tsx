"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";

interface FormState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  breedingName: string;
  street: string;
  city: string;
  postalCode: string;
}

const initialForm: FormState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  breedingName: "",
  street: "",
  city: "",
  postalCode: "",
};

export default function RegisterPage() {
  const [role, setRole] = useState<"CUSTOMER" | "BREEDER">("CUSTOMER");
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        role,
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
      };
      if (role === "BREEDER") {
        payload.breederProfile = {
          breedingName: form.breedingName,
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
        };
      }
      await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się zarejestrować");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-sm mx-auto mt-12 p-6 border rounded">
        <p className="mb-3">
          Konto utworzone. W trybie deweloperskim link weryfikacyjny trafia do logów backendu (brak
          skonfigurowanego Resend) — sprawdź terminal, a następnie się zaloguj.
        </p>
        <Link href="/login" className="underline">
          Przejdź do logowania
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 border rounded">
      <h1 className="text-xl mb-4">Zarejestruj się</h1>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setRole("CUSTOMER")}
          className={`p-2 rounded border flex-1 ${role === "CUSTOMER" ? "bg-black text-white" : ""}`}
        >
          Klient
        </button>
        <button
          type="button"
          onClick={() => setRole("BREEDER")}
          className={`p-2 rounded border flex-1 ${role === "BREEDER" ? "bg-black text-white" : ""}`}
        >
          Hodowca
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="Imię"
          value={form.firstName}
          onChange={(event) => update("firstName", event.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Nazwisko"
          value={form.lastName}
          onChange={(event) => update("lastName", event.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Hasło (min. 8 znaków)"
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Telefon (opcjonalnie)"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          className="border p-2 rounded"
        />
        {role === "BREEDER" && (
          <>
            <input
              placeholder="Nazwa hodowli"
              value={form.breedingName}
              onChange={(event) => update("breedingName", event.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              placeholder="Ulica i numer"
              value={form.street}
              onChange={(event) => update("street", event.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              placeholder="Miasto"
              value={form.city}
              onChange={(event) => update("city", event.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              placeholder="Kod pocztowy"
              value={form.postalCode}
              onChange={(event) => update("postalCode", event.target.value)}
              className="border p-2 rounded"
              required
            />
          </>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="bg-black text-white p-2 rounded">
          {loading ? "Tworzenie konta..." : "Zarejestruj się"}
        </button>
      </form>
    </div>
  );
}
