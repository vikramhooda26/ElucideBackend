import { Router } from "express";
import {
    createUser,
    deleteUserById,
    editUserById,
    fetchAllUsers,
    fetchUserDetails,
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

userRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(userRegistrationSchema),
    editUserById,
);

userRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    deleteUserById,
);
