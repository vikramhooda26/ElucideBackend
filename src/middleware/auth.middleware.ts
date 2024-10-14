import asyncHandler from "express-async-handler";
import pkg, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db/index.js";
import {
    clearAuthCookies,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "../lib/auth.js";
import { COOKIE_NAME, cookieOptions } from "../lib/constants.js";
import { ForbiddenError } from "../lib/errors.js";
import { TUser } from "../lib/types.js";

const { TokenExpiredError } = pkg;

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies[COOKIE_NAME.CSRF];

    if (!token) {
        clearAuthCookies(res);
        throw new ForbiddenError();
    }

    try {
        req.user = verifyAccessToken(token);
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            const refreshToken = req.cookies[COOKIE_NAME.REFRESH_TOKEN];

            if (!refreshToken) {
                clearAuthCookies(res);
                throw new ForbiddenError();
            }

            try {
                const decodedRefreshToken = verifyRefreshToken(refreshToken) as JwtPayload;

                const { count } = await prisma.refresh_token.deleteMany({
                    where: { token: refreshToken },
                });

                if (count < 1) {
                    throw new ForbiddenError("Refresh token not found or already deleted");
                }

                const newTokenPayload = {
                    userId: decodedRefreshToken.userId,
                    role: decodedRefreshToken.role,
                    username: decodedRefreshToken.username,
                } satisfies TUser;

                const newAccessToken = generateAccessToken(newTokenPayload);
                const newRefreshToken = await generateRefreshToken(newTokenPayload);

                req.user = verifyAccessToken(newAccessToken);

                res.cookie(COOKIE_NAME.CSRF, newAccessToken, cookieOptions);
                res.cookie(COOKIE_NAME.REFRESH_TOKEN, newRefreshToken, cookieOptions);

                next();
            } catch (error) {
                console.error(error);
                clearAuthCookies(res);
                throw new ForbiddenError();
            }
        } else {
            console.error(error);
            clearAuthCookies(res);
            throw new ForbiddenError();
        }
    }
});
