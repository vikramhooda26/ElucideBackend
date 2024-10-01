import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createLevel,
    deleteLevel,
    editLevel,
    getAllLevels,
    getLevelById,
} from "../../controllers/metadata/level.controller.js";
import { createLevelSchema, editLevelSchema } from "../../schemas/metadata/level.schema.js";

export const levelRouter = Router();

levelRouter.get("/get-all", getAllLevels);

levelRouter.get("/:id", getLevelById);

levelRouter.post("/create", roleMiddleware(["SUPER_ADMIN"]), validateSchema(createLevelSchema), createLevel);

levelRouter.put("/edit/:id", roleMiddleware(["SUPER_ADMIN"]), validateSchema(editLevelSchema), editLevel);

levelRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteLevel);
