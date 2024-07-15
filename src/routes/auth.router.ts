import { Router } from "express";
import { loginController } from "../controllers/auth.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/register", authMiddleware, roleMiddleware("SUPER_ADMIN"));
