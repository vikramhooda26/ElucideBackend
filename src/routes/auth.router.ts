import { Router } from "express";
import {
    fetchUserDetails,
    loginHandler,
    logoutHandler,
    registerHandler,
} from "../controllers/auth.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import {
    userRegistrationSchema,
    userValidationSchema,
} from "../schemas/auth.schema.js";

export const authRouter = Router();

authRouter.post("/login", validateSchema(userValidationSchema), loginHandler);

authRouter.post(
    "/register",
    authMiddleware,
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(userRegistrationSchema),
    registerHandler,
);

authRouter.get("/get-user-details", authMiddleware, fetchUserDetails);

authRouter.post("/logout", logoutHandler);
