import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createLeagueOwner,
    deleteLeagueOwner,
    editLeagueOwner,
    getAllLeagueOwners,
    getLeagueOwnerById,
} from "../../controllers/metadata/league-owner.controller.js";
import {
    createLeagueOwnerSchema,
    editLeagueOwnerSchema,
} from "../../schemas/metadata/league-owner.schema.js";

export const leagueOwnerRouter = Router();

leagueOwnerRouter.get("/get-all", getAllLeagueOwners);

leagueOwnerRouter.get("/:id", getLeagueOwnerById);

leagueOwnerRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createLeagueOwnerSchema),
    createLeagueOwner,
);

leagueOwnerRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editLeagueOwnerSchema),
    editLeagueOwner,
);

leagueOwnerRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    deleteLeagueOwner,
);
