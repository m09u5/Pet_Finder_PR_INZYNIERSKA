import type { ReactNode } from "react";
import type { AnimalFieldsProps } from "@/components/animals/form/shared/animal-form-shared.types";

export interface AnimalFormProps extends AnimalFieldsProps {
  error: string | null;
  saving: boolean;
  submitLabel: string;
  onSubmitAction: () => void;
  onCancelAction: () => void;
  children?: ReactNode;
}
