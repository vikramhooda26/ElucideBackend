import asyncHandler from "express-async-handler";
import {
    generateAccessToken,
    generateRefreshToken,
    checkUserExistence,
    verifyPassword,
    verifyRefreshToken,
} from "../lib/auth.js";
import { COOKIE_NAME, STATUS_CODE, cookieOptions } from "../lib/constants.js";
import { ForbiddenError } from "../lib/errors.js";
import { prisma } from "../db/index.js";
import { hashPassword } from "../lib/helpers.js";
import { TUserRegistration, TUserValidation } from "../schemas/auth.schema.js";
import { JwtPayload } from "jsonwebtoken";
import { tokenManager } from "../managers/TokenManager.js";
import { Request, Response } from "express";

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
        userId: user.id.toString(),
        username: user.username,
        role: user.role,
    });
    const refreshToken = await generateRefreshToken({
        userId: user.id.toString(),
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

    res.status(STATUS_CODE.OK).json({
        message: `${firstName} ${lastName} registered`,
    });
});

export const logoutHandler = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies[COOKIE_NAME.REFRESH_TOKEN];

    if (!refreshToken) {
        throw new ForbiddenError();
    }

    const decodedToken = verifyRefreshToken(refreshToken) as JwtPayload;

    const userId = decodedToken.userId;

    tokenManager.removeToken(userId);
    await prisma.refresh_token.deleteMany({
        where: { user_id: userId },
    });

    res.clearCookie(COOKIE_NAME.CSRF, cookieOptions);
    res.clearCookie(COOKIE_NAME.REFRESH_TOKEN, cookieOptions);

    res.status(STATUS_CODE.OK).json({
        message: "Logged out",
    });
});

export const fetchUserDetails = async (req: Request, res: Response) => {
    const { userId } = req.user;

    try {
        const user = await prisma.auth_user.findUnique({
            where: { id: BigInt(userId) },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                username: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            res.clearCookie(COOKIE_NAME.CSRF, cookieOptions);
            res.clearCookie(COOKIE_NAME.REFRESH_TOKEN, cookieOptions);
            tokenManager.removeToken(userId);

            throw new ForbiddenError();
        }

        res.status(STATUS_CODE.OK).json({
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error(error);
        res.clearCookie(COOKIE_NAME.CSRF, cookieOptions);
        res.clearCookie(COOKIE_NAME.REFRESH_TOKEN, cookieOptions);
        tokenManager.removeToken(userId);

        throw new ForbiddenError("Could not fetch user details");
    }
};
