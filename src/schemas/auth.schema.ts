import z from "zod";
import { roles } from "../lib/types.js";

export const userValidationSchema = z.object({
    username: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
});

export const userRegistrationSchema = z.object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email("Invalid email").min(1, "Required"),
    username: z.string().min(1, "Required"),
    role: z.enum(roles, {
        errorMap: () => ({ message: "Invalid role" }),
    }),
    password: z.string().min(1, "Required"),
});

export type TUserValidation = z.infer<typeof userValidationSchema>;
export type TUserRegistration = z.infer<typeof userRegistrationSchema>;
