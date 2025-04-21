import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../lib/errors.js";
import { TRole } from "../lib/types.js";

export const roleMiddleware = (allowedRoles: TRole[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !allowedRoles.some((role) => role === req.user.role)) {
    throw new ForbiddenError();
  }
  next();
};
