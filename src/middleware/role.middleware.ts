import { NextFunction, Request, Response } from "express";
import { TRole } from "../lib/types.js";
import { ForbiddenError } from "../lib/errors.js";

export const roleMiddleware =
    (role: TRole) => (req: Request, res: Response, next: NextFunction) => {
        if (role !== req.user.role) {
            throw new ForbiddenError();
        }

        next();
    };
