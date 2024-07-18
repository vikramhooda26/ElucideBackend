import asyncHandler from "express-async-handler";
import { COOKIE_NAME, cookieOptions } from "../lib/constants.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "../lib/auth.js";
import { prisma } from "../db/index.js";
import pkg from "jsonwebtoken";
import { TUser } from "../lib/types.js";
import { ForbiddenError } from "../lib/errors.js";

const { TokenExpiredError } = pkg;

export const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies[COOKIE_NAME.CSRF];

        if (!token) {
            throw new ForbiddenError();
        }

        req.user = verifyAccessToken(token);
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            const refreshToken = req.cookies[COOKIE_NAME.REFRESH_TOKEN];
            if (!refreshToken) {
                throw new ForbiddenError();
            }
            try {
                const decodedRefreshToken = verifyRefreshToken(refreshToken);

                const existingToken = await prisma.auth_user.findMany({
                    where: { refresh_token: refreshToken },
                });

                if (existingToken.length < 1) {
                    throw new ForbiddenError();
                }

                await prisma.auth_user.deleteMany({
                    where: { refresh_token: refreshToken },
                });

                const newAccessToken = generateAccessToken(
                    decodedRefreshToken as TUser,
                );
                const newRefreshToken = generateRefreshToken(
                    decodedRefreshToken as TUser,
                );

                req.user = verifyAccessToken(newAccessToken);
                res.cookie(COOKIE_NAME.CSRF, newAccessToken, cookieOptions);
                res.cookie(
                    COOKIE_NAME.REFRESH_TOKEN,
                    newRefreshToken,
                    cookieOptions,
                );
                next();
            } catch (error) {
                console.error(error);
                throw new ForbiddenError();
            }
        } else {
            throw new ForbiddenError();
        }
    }
});
