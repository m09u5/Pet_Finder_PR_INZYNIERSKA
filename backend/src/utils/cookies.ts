import type { Response } from "express";
import { env } from "../config/env";
import { parseDurationMs } from "./duration";

const isProd = env.NODE_ENV === "production";

const ACCESS_TOKEN_MAX_AGE_MS = parseDurationMs(env.JWT_ACCESS_EXPIRES_IN);
const REFRESH_TOKEN_MAX_AGE_MS = parseDurationMs(env.JWT_REFRESH_EXPIRES_IN);

export function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
  res.cookie("access_token", tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    path: "/",
  });


  res.cookie("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    path: "/api/auth",
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/api/auth" });
}
