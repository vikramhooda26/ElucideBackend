import asyncHandler from "express-async-handler";
import { COOKIE_NAME, cookieOptions } from "../lib/constants.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "../lib/auth.js";
import { prisma } from "../db/index.js";
import { TokenExpiredError } from "jsonwebtoken";
import { TUser } from "../lib/types.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies[COOKIE_NAME.CSRF];

    if (!token) {
        res.sendStatus(403);
    }

    try {
        req.user = verifyAccessToken(token);
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            const refreshToken = req.cookies[COOKIE_NAME.REFRESH_TOKEN];
            if (!refreshToken) {
                res.sendStatus(403);
                return;
            }
            try {
                const decodedRefreshToken = verifyRefreshToken(refreshToken);

                const existingToken = await prisma.auth_user.findMany({
                    where: { refresh_token: refreshToken },
                });

                if (existingToken.length < 1) {
                    res.sendStatus(403);
                    return;
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
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }
});
