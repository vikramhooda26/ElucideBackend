import { Router } from "express";
import {
    createLeague,
    editLeagueById,
    getAllLeagues,
    getLeagueById,
} from "../controllers/league.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import {
    createLeagueSchema,
    editLeagueSchema,
} from "../schemas/league.schema.js";

export const leagueRouter = Router();

leagueRouter.get("/:id", getLeagueById);

leagueRouter.get("/", getAllLeagues);

leagueRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createLeagueSchema),
    createLeague,
);

leagueRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editLeagueSchema),
    editLeagueById,
);
