import clsx from "clsx";
import { BreederDescription } from "@/components/breeder/breeder-description/BreederDescription";
import { BreederLogo } from "@/components/breeder/breeder-logo/BreederLogo";
import { whiteBoxClass } from "@/styles/theme";
import type { BreederHeaderProps } from "./breeder-header.types";

export function BreederHeader({
  breedingName,
  verificationStatus,
  street,
  city,
  description,
  logoUrl,
  editable,
}: BreederHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-5">
        <BreederLogo logoUrl={logoUrl} breedingName={breedingName} editable={editable} />
        <div className="min-w-0 pt-8">
          <h1 className="text-2xl break-words">{breedingName}</h1>
          {verificationStatus === "VERIFIED" && (
            <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
              Zweryfikowana hodowla
            </span>
          )}
        </div>
      </div>

      <address className={clsx(whiteBoxClass, "not-italic text-xl")}>
        {city},
        <br />
        {street}
      </address>

      <BreederDescription description={description} editable={editable} />
    </div>
  );
}
