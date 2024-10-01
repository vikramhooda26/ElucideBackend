import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createAssociationLevel,
    deleteAssociationLevel,
    editAssociationLevel,
    getAllAssociationLevels,
    getAssociationLevelById,
} from "../../controllers/metadata/association-level.controller.js";
import {
    createAssociationLevelSchema,
    editAssociationLevelSchema,
} from "../../schemas/metadata/association-level.schema.js";

export const associationLevel = Router();

associationLevel.get("/get-all", getAllAssociationLevels);

associationLevel.get("/:id", getAssociationLevelById);

associationLevel.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createAssociationLevelSchema),
    createAssociationLevel,
);

associationLevel.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(editAssociationLevelSchema),
    editAssociationLevel,
);

associationLevel.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteAssociationLevel);
