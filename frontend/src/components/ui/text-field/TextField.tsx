import clsx from "clsx";
import { fieldClass } from "@/styles/theme";
import type { TextFieldProps } from "./text-field.types";

export function TextField({ type = "text", placeholder, value, required, className, onChangeAction }: TextFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChangeAction(event.target.value)}
      required={required}
      className={clsx(fieldClass, className)}
    />
  );
}
