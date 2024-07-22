import { NextFunction, Request, Response } from "express";
import { CustomError } from "../lib/errors.js";
import { STATUS_CODE } from "../lib/constants.js";

export const globalErrorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error(err);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            message: err.message,
            ...(process.env.NODE_ENV === "development" && {
                stack: err.stack,
            }),
        });
    }

    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: err.message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
};
