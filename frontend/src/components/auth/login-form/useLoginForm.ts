import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseLoginFormResult } from "./login-form.types";

export function useLoginForm(): UseLoginFormResult {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
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

  return { email, password, error, loading, setEmail, setPassword, submit };
}
