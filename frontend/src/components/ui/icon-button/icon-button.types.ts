import type { ReactNode } from "react";
import type { IconButtonClassOptions } from "@/styles/theme.types";

export interface IconButtonProps extends IconButtonClassOptions {
  label: string;
  disabled?: boolean;
  onClickAction: () => void;
  children: ReactNode;
}
