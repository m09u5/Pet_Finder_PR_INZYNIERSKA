import { useState, type FormEvent } from "react";
import type { RegisterFormState, RegisterRole } from "@/components/auth/shared/register.types";
import { apiFetch, ApiError } from "@/lib/api";
import type { UseRegisterFormResult } from "./register-form.types";
import { initialRegisterForm, toRegisterPayload } from "./register-form.utils";

export function useRegisterForm(): UseRegisterFormResult {
  const [role, setRole] = useState<RegisterRole>("CUSTOMER");
  const [form, setForm] = useState<RegisterFormState>(initialRegisterForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function setField(field: keyof RegisterFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(toRegisterPayload(role, form)) });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Nie udało się zarejestrować");
    } finally {
      setLoading(false);
    }
  }

  return { role, form, error, success, loading, setRole, setField, submit };
}
