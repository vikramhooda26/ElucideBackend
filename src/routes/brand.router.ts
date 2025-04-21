import { Router } from "express";
import {
  createBrand,
  editBrand,
  getAllBrands,
  getBrandById,
  deleteBrand,
  getTotalBrands,
} from "../controllers/brand.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { createBrandSchema, editBrandSchema } from "../schemas/brand.schema.js";

export const brandRouter = Router();

brandRouter.get("/", getAllBrands);

brandRouter.get("/:id", getBrandById);

brandRouter.get("/count", getTotalBrands);

brandRouter.post(
  "/create",
  roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
  validateSchema(createBrandSchema),
  createBrand,
);

brandRouter.put("/edit/:id", roleMiddleware(["SUPER_ADMIN", "ADMIN"]), validateSchema(editBrandSchema), editBrand);

brandRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteBrand);
