import type { ReactNode } from "react";
import type { UserRole } from "@pet-finder/shared";

export interface AuthGateProps {
  requiredRole?: UserRole;
  message: string;
  children: ReactNode;
}
