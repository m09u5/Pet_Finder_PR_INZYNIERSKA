import type { ReactNode } from "react";

export interface IconUploadButtonProps {
  label: string;
  multiple?: boolean;
  disabled?: boolean;
  onSelectAction: (files: File[]) => void;
  children: ReactNode;
}
