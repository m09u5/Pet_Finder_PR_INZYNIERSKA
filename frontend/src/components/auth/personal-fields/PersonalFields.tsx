import type { RegisterFieldsProps } from "@/components/auth/shared/register.types";
import { TextField } from "@/components/ui/text-field/TextField";

export function PersonalFields({ form, onChangeAction }: RegisterFieldsProps) {
  return (
    <>
      <TextField
        placeholder="Imię"
        value={form.firstName}
        onChangeAction={(value) => onChangeAction("firstName", value)}
        required
      />
      <TextField
        placeholder="Nazwisko"
        value={form.lastName}
        onChangeAction={(value) => onChangeAction("lastName", value)}
        required
      />
      <TextField
        type="email"
        placeholder="E-mail"
        value={form.email}
        onChangeAction={(value) => onChangeAction("email", value)}
        required
      />
      <TextField
        type="password"
        placeholder="Hasło (min. 8 znaków)"
        value={form.password}
        onChangeAction={(value) => onChangeAction("password", value)}
        required
      />
      <TextField
        placeholder="Telefon (opcjonalnie)"
        value={form.phone}
        onChangeAction={(value) => onChangeAction("phone", value)}
      />
    </>
  );
}
