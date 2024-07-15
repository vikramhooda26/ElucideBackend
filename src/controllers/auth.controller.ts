import asyncHandler from "express-async-handler";
import z from "zod";
import {
    generateAccessToken,
    generateRefreshToken,
    checkUserExistence,
    verifyPassword,
} from "../lib/auth.js";
import { COOKIE_NAME, cookieOptions } from "../lib/constants.js";
import { ForbiddenError } from "../lib/errors.js";

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
        throw new ForbiddenError();
    }

    const passwordIsValid = await verifyPassword(password, user.password);

    if (!passwordIsValid) {
        throw new ForbiddenError();
    }

    const csrf = generateAccessToken({
        id: Number(user.id),
        username: user.username,
        role: user.role,
    });
    const refreshToken = generateRefreshToken({
        id: Number(user.id),
        username: user.username,
        role: user.role,
    });

    res.cookie(COOKIE_NAME.CSRF, csrf, cookieOptions);
    res.cookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, cookieOptions);

    res.status(200).json({
        userId: user.id,
        username: user.username,
        role: user.role,
    });
});
