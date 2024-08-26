import { Router } from "express";
import {
    createLeague,
    editLeague,
    getAllLeagues,
    getLeagueById,
    deleteLeague,
    getTotalLeagues,
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

leagueRouter.get("/count", getTotalLeagues);

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
    editLeague,
);

leagueRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    deleteLeague,
);
