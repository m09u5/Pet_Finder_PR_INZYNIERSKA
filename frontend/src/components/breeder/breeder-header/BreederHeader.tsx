import { BreederDescription } from "@/components/breeder/breeder-description/BreederDescription";
import { STATIC_BREEDER_RATING } from "@/lib/staticRating";
import { mutedTextClass } from "@/styles/theme";
import type { BreederHeaderProps } from "./breeder-header.types";

export function BreederHeader({
  breedingName,
  verificationStatus,
  street,
  city,
  postalCode,
  description,
  editable,
}: BreederHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-medium">{breedingName}</h1>
        {verificationStatus === "VERIFIED" && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Zweryfikowana hodowla</span>
        )}
      </div>
      <p className={mutedTextClass}>★ {STATIC_BREEDER_RATING}</p>
      <p className={mutedTextClass}>
        {street}, {postalCode} {city}
      </p>
      <BreederDescription description={description} editable={editable} />
    </div>
  );
}
