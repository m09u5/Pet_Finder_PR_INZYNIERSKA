"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      await refresh();
      router.push("/offers");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się zalogować");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 border rounded">
      <h1 className="text-xl mb-4">Zaloguj się</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border p-2 rounded"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="bg-black text-white p-2 rounded">
          {loading ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>
      <p className="text-sm mt-3">
        Nie masz konta?{" "}
        <Link href="/register" className="underline">
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}
