import asyncHandler from "express-async-handler";
import z from "zod";
import { STATUS_CODE } from "../lib/constants.js";

export const userValidationSchema = z.object({
    username: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
});

export const validateLoginInput = asyncHandler(async (req, res, next) => {
    const validationResult = userValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
            username: validationResult.error?.formErrors.fieldErrors.username,
            password: validationResult.error?.formErrors.fieldErrors.password,
        });
    } else {
        req.validatedData = validationResult.data;
        next();
    }
});
