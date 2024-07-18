import asyncHandler from "express-async-handler";
import z from "zod";
import { STATUS_CODE } from "../lib/constants.js";
import { roles } from "../lib/types.js";

export const userValidationSchema = z.object({
    username: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
});

export const registrationValidationSchema = z.object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email().min(1, "Required"),
    username: z.string().min(1, "Required"),
    role: z.enum(Object.values(roles) as [string, ...string[]], {
        errorMap: () => ({ message: "Invalid role" }),
    }),
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

export const validateRegistrationInput = asyncHandler(
    async (req, res, next) => {
        const validationResult = registrationValidationSchema.safeParse(
            req.body,
        );

        if (!validationResult.success) {
            res.status(STATUS_CODE.UNAUTHORIZED).json({
                firstName:
                    validationResult.error?.formErrors.fieldErrors.firstName,
                lastName:
                    validationResult.error?.formErrors.fieldErrors.lastName,
                email: validationResult.error?.formErrors.fieldErrors.email,
                username:
                    validationResult.error?.formErrors.fieldErrors.username,
                role: validationResult.error?.formErrors.fieldErrors.role,
                password:
                    validationResult.error?.formErrors.fieldErrors.password,
            });
        } else {
            req.validatedData = validationResult.data;
            next();
        }
    },
);
