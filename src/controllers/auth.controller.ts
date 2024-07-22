import asyncHandler from "express-async-handler";
import {
    generateAccessToken,
    generateRefreshToken,
    checkUserExistence,
    verifyPassword,
} from "../lib/auth.js";
import { COOKIE_NAME, STATUS_CODE, cookieOptions } from "../lib/constants.js";
import { ForbiddenError } from "../lib/errors.js";
import { prisma } from "../db/index.js";
import { hashPassword } from "../lib/helpers.js";
import { TUserRegistration, TUserValidation } from "../schemas/auth.schema.js";

export const loginHandler = asyncHandler(async (req, res) => {
    const { username, password } = req.validatedData as TUserValidation;

    const user = await checkUserExistence(username);

    if (!user) {
        throw new ForbiddenError();
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
        throw new ForbiddenError();
    }

    const csrf = generateAccessToken({
        id: JSON.stringify(user.id),
        username: user.username,
        role: user.role,
    });
    const refreshToken = await generateRefreshToken({
        id: JSON.stringify(user.id),
        username: user.username,
        role: user.role,
    });

    res.cookie(COOKIE_NAME.CSRF, csrf, cookieOptions);
    res.cookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, cookieOptions);

    res.status(STATUS_CODE.OK).json({
        userId: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    });
});

export const registerHandler = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, username, password, role } =
        req.validatedData as TUserRegistration;

    const hashedPassword = await hashPassword(password);

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

    res.status(STATUS_CODE.OK).send(`${firstName} ${lastName} registered`);
});
