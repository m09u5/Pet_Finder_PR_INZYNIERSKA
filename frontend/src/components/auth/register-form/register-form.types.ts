import type { FormEvent } from "react";
import type { RegisterFormState, RegisterRole } from "@/components/auth/shared/register.types";

export interface UseRegisterFormResult {
  role: RegisterRole;
  form: RegisterFormState;
  error: string | null;
  success: boolean;
  loading: boolean;
  setRole: (role: RegisterRole) => void;
  setField: (field: keyof RegisterFormState, value: string) => void;
  submit: (event: FormEvent) => Promise<void>;
}
