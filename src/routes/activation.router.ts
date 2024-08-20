import { Router } from "express";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import {
    createActivation,
    deleteActivation,
    editActivation,
    getActivationById,
    getAllActivations,
} from "../controllers/activation.controller.js";
import {
    createActivationSchema,
    editActivationSchema,
} from "../schemas/activation.schema.js";

export const activationRouter = Router();

activationRouter.get("/get-all", getAllActivations);

activationRouter.get("/:id", getActivationById);

activationRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(createActivationSchema),
    createActivation,
);

activationRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(editActivationSchema),
    editActivation,
);

activationRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    deleteActivation,
);
