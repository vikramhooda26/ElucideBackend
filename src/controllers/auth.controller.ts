import asyncHandler from "express-async-handler";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db/index.js";
import {
  checkUserExistence,
  clearAuthCookies,
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
  verifyRefreshToken,
} from "../lib/auth.js";
import { COOKIE_NAME, STATUS_CODE, cookieOptions } from "../lib/constants.js";
import { ForbiddenError } from "../lib/errors.js";
import { tokenManager } from "../managers/TokenManager.js";
import { TUserValidation } from "../schemas/auth.schema.js";

export const loginHandler = asyncHandler(async (req, res) => {
  const { username, password } = req.validatedData as TUserValidation;

  const user = await checkUserExistence(username);

  if (!user) {
    throw new ForbiddenError("This user does not exist");
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new ForbiddenError("Invalid credentials");
  }

  const csrf = await generateAccessToken({
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

  clearAuthCookies(res);

  res.status(STATUS_CODE.OK).json({
    message: "Logged out",
  });
});
