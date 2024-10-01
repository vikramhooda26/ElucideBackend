import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createTagline,
    deleteTagline,
    editTagline,
    getAllTaglines,
    getTaglineById,
} from "../../controllers/metadata/tagline.controller.js";
import { createTaglineSchema, editTaglineSchema } from "../../schemas/metadata/tagline.schema.js";

export const taglineRouter = Router();

taglineRouter.get("/get-all", getAllTaglines);

taglineRouter.get("/:id", getTaglineById);

taglineRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createTaglineSchema),
    createTagline,
);

taglineRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editTaglineSchema),
    editTagline,
);

taglineRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteTagline);
