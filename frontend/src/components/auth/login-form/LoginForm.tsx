"use client";

import Link from "next/link";
import { TextField } from "@/components/ui/text-field/TextField";
import { buttonClass, errorTextClass, pageTitleClass, panelClass } from "@/styles/theme";
import { useLoginForm } from "./useLoginForm";

export function LoginForm() {
  const { email, password, error, loading, setEmail, setPassword, submit } = useLoginForm();

  return (
    <div className={panelClass}>
      <h1 className={pageTitleClass}>Zaloguj się</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <TextField type="email" placeholder="E-mail" value={email} onChangeAction={setEmail} required />
        <TextField type="password" placeholder="Hasło" value={password} onChangeAction={setPassword} required />
        {error && <p className={errorTextClass}>{error}</p>}
        <button type="submit" disabled={loading} className={buttonClass()}>
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
