import { Router } from "express";
import { validateSchema } from "../../middleware/validate.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import {
  createSubpersonality,
  deleteSubpersonality,
  editSubpersonality,
  getAllSubpersonalities,
  getSubpersonalityById,
} from "../../controllers/metadata/subpersonality.controller.js";
import { createSubpersonalitySchema, editSubpersonalitySchema } from "../../schemas/metadata/subpersonality.js";

export const subpersonalityRouter = Router();

subpersonalityRouter.get("/get-all", getAllSubpersonalities);

subpersonalityRouter.get("/:id", getSubpersonalityById);

subpersonalityRouter.post(
  "/create",
  roleMiddleware(["SUPER_ADMIN"]),
  validateSchema(createSubpersonalitySchema),
  createSubpersonality,
);

subpersonalityRouter.put(
  "/edit/:id",
  roleMiddleware(["SUPER_ADMIN"]),
  validateSchema(editSubpersonalitySchema),
  editSubpersonality,
);

subpersonalityRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteSubpersonality);
