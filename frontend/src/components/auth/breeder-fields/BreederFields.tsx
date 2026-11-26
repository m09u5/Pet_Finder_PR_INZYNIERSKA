import type { RegisterFieldsProps } from "@/components/auth/shared/register.types";
import { TextField } from "@/components/ui/text-field/TextField";

export function BreederFields({ form, onChangeAction }: RegisterFieldsProps) {
  return (
    <>
      <TextField
        placeholder="Nazwa hodowli"
        value={form.breedingName}
        onChangeAction={(value) => onChangeAction("breedingName", value)}
        required
      />
      <TextField
        placeholder="Ulica i numer"
        value={form.street}
        onChangeAction={(value) => onChangeAction("street", value)}
        required
      />
      <TextField
        placeholder="Miasto"
        value={form.city}
        onChangeAction={(value) => onChangeAction("city", value)}
        required
      />
      <TextField
        placeholder="Kod pocztowy"
        value={form.postalCode}
        onChangeAction={(value) => onChangeAction("postalCode", value)}
        required
      />
    </>
  );
}
