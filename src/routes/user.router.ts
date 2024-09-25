import { Router } from "express";
import {
    fetchAllUsers,
    fetchUserDetails,
    createUser,
} from "../controllers/user.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { userRegistrationSchema } from "../schemas/auth.schema.js";

export const userRouter = Router();

userRouter.get("/get-by-id", fetchUserDetails);

userRouter.get("/", roleMiddleware(["SUPER_ADMIN"]), fetchAllUsers);

userRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(userRegistrationSchema),
    createUser,
);

userRouter.get(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(userRegistrationSchema),
    fetchAllUsers,
);

userRouter.get("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), fetchAllUsers);
