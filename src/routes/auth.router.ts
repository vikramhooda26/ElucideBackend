import { Router } from "express";
import {
    loginController,
    registerController,
} from "../controllers/auth.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import {
    registrationValidationSchema,
    userValidationSchema,
} from "../schemas/auth.schema.js";

export const authRouter = Router();

authRouter.post(
    "/login",
    validateSchema(userValidationSchema),
    loginController,
);
authRouter.post(
    "/register",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    validateSchema(registrationValidationSchema),
    registerController,
);
