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

/**
 * Helper function to verify and decode the refresh token.
 * @param refreshToken - The refresh token from the client.
 * @returns Decoded payload if the refresh token is valid.
 */
async function handleRefreshToken(refreshToken: string): Promise<TUser> {
    const decodedToken = verifyRefreshToken(refreshToken) as JwtPayload;

    const userExists = await prisma.auth_user.findFirst({
        where: {
            id: BigInt(decodedToken.userId),
            isDeleted: false,
            refresh_token: { some: { token: refreshToken } },
        },
        select: { id: true },
    });

    if (!userExists) throw new ForbiddenError("Refresh token not found or already deleted");

    await prisma.auth_user.update({
        where: {
            id: BigInt(decodedToken.userId),
            isDeleted: false,
            refresh_token: { some: { token: refreshToken } },
        },
        data: { refresh_token: { delete: { token: refreshToken } } },
        select: { id: true },
    });

    return {
        userId: decodedToken.userId,
        role: decodedToken.role,
        username: decodedToken.username,
    } satisfies TUser;
}

/**
 * Middleware to handle authentication using CSRF and refresh tokens.
 * Verifies the access token and, if expired, uses the refresh token to re-authenticate.
 */
export const authMiddleware = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies[COOKIE_NAME.CSRF];
    const refreshToken = req.cookies[COOKIE_NAME.REFRESH_TOKEN];

    if (!accessToken) {
        clearAuthCookies(res);
        throw new ForbiddenError("No access token provided");
    }

    try {
        req.user = verifyAccessToken(accessToken);
        return next();
    } catch (error) {
        if (!(error instanceof TokenExpiredError)) {
            clearAuthCookies(res);
            console.error("Access token validation error:", error);
            throw new ForbiddenError("Invalid access token");
        }

        if (!refreshToken) {
            clearAuthCookies(res);
            throw new ForbiddenError("No refresh token provided");
        }

        try {
            const userPayload = await handleRefreshToken(refreshToken);
            const newAccessToken = await generateAccessToken(userPayload);
            const newRefreshToken = await generateRefreshToken(userPayload);

            req.user = verifyAccessToken(newAccessToken);

            res.cookie(COOKIE_NAME.CSRF, newAccessToken, cookieOptions);
            res.cookie(COOKIE_NAME.REFRESH_TOKEN, newRefreshToken, cookieOptions);

            next();
        } catch (refreshError) {
            clearAuthCookies(res);
            console.error("Refresh token error:", refreshError);
            throw new ForbiddenError("Failed to refresh access token");
        }
    }
});
