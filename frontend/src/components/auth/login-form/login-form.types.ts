import type { FormEvent } from "react";

export interface UseLoginFormResult {
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: (event: FormEvent) => Promise<void>;
}
