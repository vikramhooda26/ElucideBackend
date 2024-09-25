import { Router } from "express";
import { loginHandler, logoutHandler } from "../controllers/auth.controller.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { userValidationSchema } from "../schemas/auth.schema.js";

export const authRouter = Router();

authRouter.post("/login", validateSchema(userValidationSchema), loginHandler);

authRouter.post("/logout", logoutHandler);
