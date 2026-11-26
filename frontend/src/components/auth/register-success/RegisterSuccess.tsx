import Link from "next/link";
import { panelClass } from "@/styles/theme";

export function RegisterSuccess() {
  return (
    <div className={panelClass}>
      <p className="mb-3">
        Konto utworzone poki co link do potwoerdzenia w konsoli backendu
      </p>
      <Link href="/login" className="underline">
        Przejdź do logowania
      </Link>
    </div>
  );
}
