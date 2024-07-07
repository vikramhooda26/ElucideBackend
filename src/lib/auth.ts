import { prisma } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || "myAccessTokenSecret";
const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || "myRefreshTokenSecret";

type TUser = {
    id: string;
    username: string;
};

export const generateAccessToken = (user: TUser) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
};

export const generateRefreshToken = async (user: TUser) => {
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);

    // add logic to push the refreshToken to database
    return refreshToken;
};

export const validatePassword = async (
    password: string,
    hashedPassword: string,
): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const userExists = async (username: string) => {
    const user = await prisma.auth_user.findFirst({
        where: { username },
        select: {
            id: true,
            username: true,
            password: true,
        },
    });

    return user
        ? { id: user.id, username: user.username, password: user.password }
        : {};
};

export const verifyAccessToken = () => {};

export const verifyRefreshToken = () => {};
