import { prisma } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { tokenManager } from "../managers/TokenManager.js";
import { CookieOptions } from "express";
import { TUser } from "./types.js";

const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || "myAccessTokenSecret";
const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || "myRefreshTokenSecret";

export const generateAccessToken = (user: TUser) => {
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });

    tokenManager.setToken(user.id, accessToken);
    return accessToken;
};

export const generateRefreshToken = async (user: TUser) => {
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);

    await prisma.refresh_token.create({
        data: {
            token: refreshToken,
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    return refreshToken;
};

export const verifyPassword = async (
    password: string,
    hashedPassword: string,
): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const checkUserExistence = async (username: string) => {
    const user = await prisma.auth_user.findFirst({
        where: { username },
        select: {
            id: true,
            username: true,
            password: true,
            role: true,
        },
    });

    return user
        ? {
              id: user.id,
              username: user.username,
              password: user.password,
              role: user.role,
          }
        : {};
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
