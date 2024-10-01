import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createNccs,
    deleteNccs,
    editNccs,
    getAllNccs,
    getNccsById,
} from "../../controllers/metadata/nccs.controller.js";
import { createNccsSchema, editNccsSchema } from "../../schemas/metadata/nccs.schema.js";

export const nccsRouter = Router();

nccsRouter.get("/get-all", getAllNccs);

nccsRouter.get("/:id", getNccsById);

nccsRouter.post("/create", roleMiddleware(["SUPER_ADMIN"]), validateSchema(createNccsSchema), createNccs);

nccsRouter.put("/edit/:id", roleMiddleware(["SUPER_ADMIN"]), validateSchema(editNccsSchema), editNccs);

nccsRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteNccs);
