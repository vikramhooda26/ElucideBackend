import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
  createAthleteStatus,
  deleteAthleteStatus,
  editAthleteStatus,
  getAllAthleteStatus,
  getAthleteStatusById,
} from "../../controllers/metadata/athlete-status.controller.js";
import { createAthleteStatusSchema, editAthleteStatusSchema } from "../../schemas/metadata/athlete-status.schema.js";

export const athleteStatusRouter = Router();

athleteStatusRouter.get("/get-all", getAllAthleteStatus);

athleteStatusRouter.get("/:id", getAthleteStatusById);

athleteStatusRouter.post(
  "/create",
  roleMiddleware(["SUPER_ADMIN"]),
  validateSchema(createAthleteStatusSchema),
  createAthleteStatus,
);

athleteStatusRouter.put(
  "/edit/:id",
  roleMiddleware(["SUPER_ADMIN"]),
  validateSchema(editAthleteStatusSchema),
  editAthleteStatus,
);

athleteStatusRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteAthleteStatus);
