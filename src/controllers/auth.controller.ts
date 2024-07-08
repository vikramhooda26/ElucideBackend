import { CookieOptions } from "express";
import asyncHandler from "express-async-handler";
import z from "zod";
import {
    generateAccessToken,
    generateRefreshToken,
    checkUserExistence,
    verifyPassword,
} from "../lib/auth.js";
import { COOKIE_NAME } from "../lib/constants.js";

const userValidationSchema = z.object({
    username: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
});

export const loginController = asyncHandler(async (req, res) => {
    const validationResult = userValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
        res.status(401).json({
            username: validationResult.error?.formErrors.fieldErrors.username,
            password: validationResult.error?.formErrors.fieldErrors.password,
        });
        return;
    }

    const { username, password } = validationResult.data;

    const user = await checkUserExistence(username);

    if (!user.username) {
        res.sendStatus(403);
        return;
    }

    const passwordIsValid = await verifyPassword(password, user.password);

    if (!passwordIsValid) {
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

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    } satisfies CookieOptions;

    res.cookie(COOKIE_NAME.CSRF, csrf, cookieOptions);
    res.cookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, cookieOptions);

    res.status(200).send("Logged in");
});
