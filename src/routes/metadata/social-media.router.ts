import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
  createSocialMedia,
  deleteSocialMedia,
  editSocialMedia,
  getAllSocialMedias,
  getSocialMediaById,
} from "../../controllers/metadata/social-media.controller.js";
import { createSocialMediaSchema, editSocialMediaSchema } from "../../schemas/metadata/social-media.schema.js";

export const socialMediaRouter = Router();

socialMediaRouter.get("/get-all", getAllSocialMedias);

socialMediaRouter.get("/:id", getSocialMediaById);

socialMediaRouter.post(
  "/create",
  roleMiddleware(["SUPER_ADMIN"]),
  validateSchema(createSocialMediaSchema),
  createSocialMedia,
);

socialMediaRouter.put(
  "/edit/:id",
  roleMiddleware(["SUPER_ADMIN"]),
  validateSchema(editSocialMediaSchema),
  editSocialMedia,
);

socialMediaRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteSocialMedia);
