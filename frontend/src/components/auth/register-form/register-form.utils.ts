import type { RegisterInput } from "@pet-finder/shared";
import type { RegisterFormState, RegisterRole } from "@/components/auth/shared/register.types";
import type { ToggleOption } from "@/components/ui/toggle-group/toggle-group.types";

export const ROLE_OPTIONS: ToggleOption<RegisterRole>[] = [
  { value: "CUSTOMER", label: "Klient" },
  { value: "BREEDER", label: "Hodowca" },
];

export const initialRegisterForm: RegisterFormState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  breedingName: "",
  street: "",
  city: "",
  postalCode: "",
};

export function toRegisterPayload(role: RegisterRole, form: RegisterFormState): RegisterInput {
  const account = {
    email: form.email,
    password: form.password,
    firstName: form.firstName,
    lastName: form.lastName,
    phone: form.phone || undefined,
  };

  if (role === "CUSTOMER") return { role, ...account };

  return {
    role,
    ...account,
    breederProfile: {
      breedingName: form.breedingName,
      street: form.street,
      city: form.city,
      postalCode: form.postalCode,
    },
  };
}
