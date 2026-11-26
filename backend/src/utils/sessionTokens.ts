import type { User } from "@prisma/client";
import { signAccessToken, signRefreshToken } from "./jwt";

export function createSessionTokens(user: User) {
  return {
    accessToken: signAccessToken({ sub: user.id, role: user.role, email: user.email }),
    refreshToken: signRefreshToken({ sub: user.id }),
  };
}
