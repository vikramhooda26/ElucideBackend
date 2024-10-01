import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createSubcategory,
    deleteSubcategory,
    editSubcategory,
    getAllSubcategories,
    getsubcategoryById,
} from "../../controllers/metadata/subcategory.controller.js";
import { createSubcategorySchema, editSubcategorySchema } from "../../schemas/metadata/subcategory.schema.js";

export const subcategoryRouter = Router();

subcategoryRouter.get("/get-all", getAllSubcategories);

subcategoryRouter.get("/:id", getsubcategoryById);

subcategoryRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(createSubcategorySchema),
    createSubcategory,
);

subcategoryRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(editSubcategorySchema),
    editSubcategory,
);

subcategoryRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteSubcategory);
