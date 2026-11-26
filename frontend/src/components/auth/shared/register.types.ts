import type { UserRole } from "@pet-finder/shared";

export type RegisterRole = Exclude<UserRole, "ADMIN">;

export interface RegisterFormState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  breedingName: string;
  street: string;
  city: string;
  postalCode: string;
}

export interface RegisterFieldsProps {
  form: RegisterFormState;
  onChangeAction: (field: keyof RegisterFormState, value: string) => void;
}
