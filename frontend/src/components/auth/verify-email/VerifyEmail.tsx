"use client";

import Link from "next/link";
import { ApiError } from "@/lib/api";
import { buttonClass, errorTextClass, mutedTextClass, pageTitleClass, panelClass } from "@/styles/theme";
import { useVerifyEmail } from "./useVerifyEmail";
import type { VerifyEmailProps } from "./verify-email.types";

export function VerifyEmail({ token }: VerifyEmailProps) {
  const { data, error } = useVerifyEmail(token);
  const failed = token === "" || error !== null;

  return (
    <div className={panelClass}>
      <h1 className={pageTitleClass}>Potwierdzenie adresu e-mail</h1>

      {token === "" && <p className={errorTextClass}>Link potwierdzający jest niekompletny.</p>}
      {error && (
        <p className={errorTextClass}>
          {error instanceof ApiError ? error.message : "Nie udało się potwierdzić adresu e-mail"}
        </p>
      )}
      {!failed && <p>{data ? data.message : "Potwierdzanie adresu e-mail..."}</p>}

      {failed && <p className={mutedTextClass}>Jeśli konto zostało już potwierdzone, możesz się zalogować.</p>}
      {(failed || data) && (
        <Link href="/login" className={buttonClass({ fullWidth: true, className: "mt-4" })}>
          Przejdź do logowania
        </Link>
      )}
    </div>
  );
}
