import { Router } from "express";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import {
  createSportsDealSummary,
  deleteSportsDealSummary,
  editSportsDealSummary,
  getAllSportsDealSummaries,
  getSportsDealSummaryById,
} from "../controllers/sports-deal-summary.controller.js";
import { createSportsDealSummarySchema, editSportsDealSummarySchema } from "../schemas/sports-deal-summary.schema.js";

export const sportsDealSummaryRouter = Router();

sportsDealSummaryRouter.get("/get-all", getAllSportsDealSummaries);

sportsDealSummaryRouter.get("/:id", getSportsDealSummaryById);

sportsDealSummaryRouter.post(
  "/create",
  roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
  validateSchema(createSportsDealSummarySchema),
  createSportsDealSummary,
);

sportsDealSummaryRouter.put(
  "/edit/:id",
  roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
  validateSchema(editSportsDealSummarySchema),
  editSportsDealSummary,
);

sportsDealSummaryRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteSportsDealSummary);
