import type { AnimalSex } from "@pet-finder/shared";

export interface AnimalFormState {
  description: string;
  price: string;
  name: string;
  species: string;
  breed: string;
  sex: AnimalSex;
  birthDate: string;
  motherName: string;
  fatherName: string;
}

export type AnimalFormChangeHandler = <K extends keyof AnimalFormState>(field: K, value: AnimalFormState[K]) => void;

export interface AnimalFieldsProps {
  form: AnimalFormState;
  onChangeAction: AnimalFormChangeHandler;
}

export interface UseAnimalFormResult {
  form: AnimalFormState;
  setField: AnimalFormChangeHandler;
  replaceForm: (next: AnimalFormState) => void;
}

export interface AnimalFormController {
  form: AnimalFormState;
  setField: AnimalFormChangeHandler;
  error: string | null;
  saving: boolean;
  submit: () => Promise<void>;
  cancel: () => void;
}
