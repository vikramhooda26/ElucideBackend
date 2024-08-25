import { Router } from "express";
import {
    createAthlete,
    editAthlete,
    getAllAthletes,
    getAthleteById,
    removeAthlete,
} from "../controllers/athlete.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import {
    createAthleteSchema,
    editAthleteSchema,
} from "../schemas/athlete.schema.js";

export const athleteRouter = Router();

athleteRouter.get("/", getAllAthletes);

athleteRouter.get("/:id", getAthleteById);

athleteRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createAthleteSchema),
    createAthlete,
);

athleteRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editAthleteSchema),
    editAthlete,
);

athleteRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    removeAthlete,
);
