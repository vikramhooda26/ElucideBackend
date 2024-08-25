import { Router } from "express";
import {
    createTeam,
    editTeam,
    getAllTeams,
    getTeamById,
    deleteTeam,
} from "../controllers/team.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { createTeamSchema, editTeamSchema } from "../schemas/team.schema.js";

export const teamRouter = Router();

teamRouter.get("/", getAllTeams);

teamRouter.get("/:id", getTeamById);

teamRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createTeamSchema),
    createTeam,
);

teamRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editTeamSchema),
    editTeam,
);

teamRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteTeam);
