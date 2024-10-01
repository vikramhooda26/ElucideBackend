import bcrypt from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/index.js";
import { tokenManager } from "../managers/TokenManager.js";
import { COOKIE_NAME } from "./constants.js";
import { TUser } from "./types.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "myAccessTokenSecret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "myRefreshTokenSecret";

export const generateAccessToken = (user: TUser) => {
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });

    tokenManager.setToken(user.userId, accessToken);

    return accessToken;
};

export const generateRefreshToken = async (user: TUser) => {
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);

    await prisma.refresh_token.create({
        data: {
            token: refreshToken,
            auth_user: {
                connect: {
                    id: BigInt(user.userId),
                },
            },
        },
    });

    return refreshToken;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const checkUserExistence = async (username: string) => {
    const user = await prisma.auth_user.findFirst({
        where: { username, isDeleted: false },
        select: {
            id: true,
            first_name: true,
            email: true,
            last_name: true,
            username: true,
            role: true,
            password: true,
        },
    });

    return user
        ? {
              id: user.id,
              username: user.username,
              password: user.password,
              role: user.role,
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
          }
        : null;
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

export const clearAuthCookies = (res: Response) => {
    res.clearCookie(COOKIE_NAME.CSRF);
    res.clearCookie(COOKIE_NAME.REFRESH_TOKEN);
};
