import type { PublicUser } from "@pet-finder/shared";

export interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}
