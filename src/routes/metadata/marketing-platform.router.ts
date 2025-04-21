import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
  createMarkingPlatform,
  deleteMarkingPlatform,
  editMarkingPlatform,
  getAllMarkingPlatforms,
  getMarkingPlatformById,
} from "../../controllers/metadata/marketing-platform.controller.js";
import {
  createMarkingPlatformSchema,
  editMarkingPlatformSchema,
} from "../../schemas/metadata/marketing-platform.schema.js";

export const marketingPlatformRouter = Router();

marketingPlatformRouter.get("/get-all", getAllMarkingPlatforms);

marketingPlatformRouter.get("/:id", getMarkingPlatformById);

marketingPlatformRouter.post(
  "/create",
  roleMiddleware(["SUPER_ADMIN"]),
  validateSchema(createMarkingPlatformSchema),
  createMarkingPlatform,
);

marketingPlatformRouter.put(
  "/edit/:id",
  roleMiddleware(["SUPER_ADMIN"]),
  validateSchema(editMarkingPlatformSchema),
  editMarkingPlatform,
);

marketingPlatformRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteMarkingPlatform);
