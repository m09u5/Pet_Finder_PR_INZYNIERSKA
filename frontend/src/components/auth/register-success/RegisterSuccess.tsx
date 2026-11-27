import Link from "next/link";
import { panelClass } from "@/styles/theme";

export function RegisterSuccess() {
  return (
    <div className={panelClass}>
      <p className="mb-3">Konto utworzone. Wysłaliśmy na Twój e-mail link potwierdzający.</p>
      <Link href="/login" className="underline">
        Przejdź do logowania
      </Link>
    </div>
  );
}
