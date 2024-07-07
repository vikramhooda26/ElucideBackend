import { CookieOptions, Router } from "express";
import asyncHandler from "express-async-handler";
import z from "zod";
import {
    generateAccessToken,
    generateRefreshToken,
    userExists,
    validatePassword,
} from "../lib/auth.js";
import { COOKIE_NAME } from "../lib/constants.js";

export const authRouter = Router();

const userSchema = z.object({
    username: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
});

authRouter.post(
    "/login",
    asyncHandler(async (req, res) => {
        const result = userSchema.safeParse(req.body);

        if (!result.success) {
            res.status(401).json({
                username: result.error?.formErrors.fieldErrors.username,
                password: result.error?.formErrors.fieldErrors.password,
            });
            return;
        }

        const { username, password } = result.data;

        const user = await userExists(username);

        if (!user.username) {
            res.sendStatus(403);
            return;
        }

        const isVerified = await validatePassword(password, user.password);

        if (!isVerified) {
            res.sendStatus(403);
            return;
        }

        const csrf = generateAccessToken({
            id: JSON.stringify(user.id),
            username: user.username,
        });
        const refreshToken = generateRefreshToken({
            id: JSON.stringify(user.id),
            username: user.username,
        });

        const options = {
            httpOnly: true,
            secure: true,
        } satisfies CookieOptions;

        res.cookie(COOKIE_NAME.CSRF, csrf, options);
        res.cookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, options);

        res.status(200).send("Logged in");
    }),
);
