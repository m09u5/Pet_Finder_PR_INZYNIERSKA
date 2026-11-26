"use client";

import { useAuth } from "@/context/AuthContext";
import { pageClass } from "@/styles/theme";
import type { AuthGateProps } from "./auth-gate.types";

export function AuthGate({ requiredRole, message, children }: AuthGateProps) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || (requiredRole && user.role !== requiredRole)) return <p className={pageClass}>{message}</p>;

  return children;
}
