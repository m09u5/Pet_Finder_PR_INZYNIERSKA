import type { ReactNode } from "react";

export interface DropdownProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}
