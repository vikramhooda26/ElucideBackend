import asyncHandler from "express-async-handler";
import {
    generateAccessToken,
    generateRefreshToken,
    checkUserExistence,
    verifyPassword,
} from "../lib/auth.js";
import { COOKIE_NAME, cookieOptions } from "../lib/constants.js";
import { ForbiddenError } from "../lib/errors.js";
import { prisma } from "../db/index.js";
import { getHashedPassword } from "../lib/helper.js";

export const loginController = asyncHandler(async (req, res) => {
    const { username, password } = req.validatedData;

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

export const registerController = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, username, password, role } =
        req.validatedData;

    const hashedPassword = await getHashedPassword(password);

    await prisma.auth_user.create({
        data: {
            first_name: firstName,
            last_name: lastName,
            email,
            username,
            role,
            password: hashedPassword,
            date_joined: new Date(Date.now()),
        },
    });

    res.status(200).send("Success");
});
