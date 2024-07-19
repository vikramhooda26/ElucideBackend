import { Router } from "express";
import {
    addAthleteController,
    fetchAllAthletesController,
    fetchAthleteByIdController,
} from "../controllers/athlete.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { athleteSchema } from "../schemas/athlete.schema.js";

export const athleteRouter = Router();

athleteRouter.get("/:id", fetchAthleteByIdController);
athleteRouter.get("/", fetchAllAthletesController);
athleteRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(athleteSchema),
    addAthleteController,
);
