import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { COOKIE_NAME, cookieOptions, STATUS_CODE } from "../lib/constants.js";
import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
} from "../lib/errors.js";
import { hashPassword } from "../lib/helpers.js";
import { printLogs } from "../lib/log.js";
import { tokenManager } from "../managers/TokenManager.js";
import { TUserEdit, TUserRegistration } from "../schemas/auth.schema.js";

export const fetchUserDetails = asyncHandler(
    async (req: Request, res: Response) => {
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
    },
);

export const fetchUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        throw new BadRequestError("User ID not found");
    }

    const userExists = await prisma.auth_user.findUnique({
        where: { id: BigInt(userId) },
        select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true,
        },
    });

    if (!userExists?.id) {
        throw new NotFoundError("This user does not exist");
    }

    res.status(STATUS_CODE.OK).json({
        id: userExists.id,
        username: userExists.username,
        firstName: userExists.first_name,
        lastName: userExists.last_name,
        email: userExists.email,
        role: userExists.role,
    });
});

export const fetchAllUsers = asyncHandler(async (req, res) => {
    const { userId } = req.user;

    printLogs("userId", userId);

    const users = await prisma.auth_user.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            username: true,
            email: true,
            date_joined: true,
            role: true,
        },
    });

    if (!users.length) {
        throw new NotFoundError("No user found");
    }

    res.status(STATUS_CODE.OK).json({ users });
});

export const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, username, password, role } =
        req.validatedData as TUserRegistration;

    const userExists = await prisma.auth_user.findUnique({
        where: { username },
        select: { id: true },
    });

    if (userExists?.id) {
        res.status(409).json({ message: "Username already exists" });
        return;
    }

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

export const deleteUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        throw new BadRequestError("User ID not found");
    }

    const userExists = await prisma.auth_user.findUnique({
        where: { id: BigInt(userId) },
        select: { id: true },
    });

    if (!userExists?.id) {
        throw new NotFoundError("This user does not exist");
    }

    await prisma.auth_user.update({
        where: { id: BigInt(userId) },
        data: { isDeleted: true },
    });

    res.status(STATUS_CODE.OK).json({
        message: "User deleted successfully",
    });
});

export const editUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        throw new BadRequestError("User ID not found");
    }

    const userExists = await prisma.auth_user.findUnique({
        where: { id: BigInt(userId) },
        select: { id: true, username: true },
    });

    if (!userExists?.id) {
        throw new NotFoundError("This user does not exist");
    }

    const { email, firstName, lastName, password, role, username } =
        req.validatedData as TUserEdit;

    if (userExists.username !== username) {
        const usernameExists = await prisma.auth_user.findUnique({
            where: { username },
            select: { id: true },
        });

        if (usernameExists?.id) {
            throw new ConflictError("This username already exist");
        }
    }

    let hashedPassword;

    if (password) {
        hashedPassword = await hashPassword(password);
    }

    await prisma.auth_user.update({
        where: { id: BigInt(userId) },
        data: {
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            role,
            password: hashedPassword || undefined,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "User details updated",
    });
});
