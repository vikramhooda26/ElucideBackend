import { Router } from "express";
import {
    loginController,
    registerController,
} from "../controllers/auth.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateLoginInput } from "../middleware/validation.middleware.js";

export const authRouter = Router();

authRouter.post("/login", validateLoginInput, loginController);
authRouter.post(
    "/register",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    registerController,
);
