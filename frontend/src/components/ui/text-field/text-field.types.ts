import type { HTMLInputTypeAttribute } from "react";

export interface TextFieldProps {
  type?: HTMLInputTypeAttribute;
  placeholder: string;
  value: string;
  required?: boolean;
  className?: string;
  onChangeAction: (value: string) => void;
}
