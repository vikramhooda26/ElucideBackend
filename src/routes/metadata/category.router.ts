import { Router } from "express";
import { validateSchema } from "../../middleware/validate.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import {
    createCategory,
    deleteCategory,
    editCategory,
    getAllCategories,
    getCategoryById,
} from "../../controllers/metadata/category.controller.js";
import { createCategorySchema, editCategorySchema } from "../../schemas/metadata/category.schema.js";

export const categoryRouter = Router();

categoryRouter.get("/get-all", getAllCategories);

categoryRouter.get("/:id", getCategoryById);

categoryRouter.post("/create", roleMiddleware(["SUPER_ADMIN"]), validateSchema(createCategorySchema), createCategory);

categoryRouter.put("/edit/:id", roleMiddleware(["SUPER_ADMIN"]), validateSchema(editCategorySchema), editCategory);

categoryRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteCategory);
