import { CookieOptions } from "express";

export const COOKIE_NAME = {
    CSRF: "csrf",
    REFRESH_TOKEN: "refreshToken",
} as const;

export const cookieOptions = {
    httpOnly: true,
    secure: true,
} satisfies CookieOptions;
