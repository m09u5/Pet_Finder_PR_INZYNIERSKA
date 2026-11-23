import type { ClassValue } from "clsx";

export type ButtonVariant = "primary" | "outline";

export type ButtonSize = "sm" | "md";

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: ClassValue;
}
