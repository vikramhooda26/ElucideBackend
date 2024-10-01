import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createPersonality,
    deletePersonality,
    editPersonality,
    getAllPersonalities,
    getPersonalityById,
} from "../../controllers/metadata/personality.controller.js";
import { createPersonalitySchema, editPersonalitySchema } from "../../schemas/metadata/personality.schema.js";

export const personalityRouter = Router();

personalityRouter.get("/get-all", getAllPersonalities);

personalityRouter.get("/:id", getPersonalityById);

personalityRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(createPersonalitySchema),
    createPersonality,
);

personalityRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(editPersonalitySchema),
    editPersonality,
);

personalityRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deletePersonality);
