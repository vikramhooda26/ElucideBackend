import { NextFunction, Request, Response } from "express";
import { TRole } from "../lib/types.js";

export const roleMiddleware =
    (role: TRole) => (req: Request, res: Response, next: NextFunction) => {
        if (role !== req.user.role) {
            res.sendStatus(403);
            return;
        }

        next();
    };
