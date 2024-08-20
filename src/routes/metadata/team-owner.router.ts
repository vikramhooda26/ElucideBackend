import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createTeamOwner,
    deleteTeamOwner,
    editTeamOwner,
    getAllTeamOwners,
    getTeamOwnerById,
} from "../../controllers/metadata/team-owner.controller.js";
import {
    createTeamOwnerSchema,
    editTeamOwnerSchema,
} from "../../schemas/metadata/team-owner.schema.js";

export const teamOwnerRouter = Router();

teamOwnerRouter.get("/get-all", getAllTeamOwners);

teamOwnerRouter.get("/:id", getTeamOwnerById);

teamOwnerRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(createTeamOwnerSchema),
    createTeamOwner,
);

teamOwnerRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(editTeamOwnerSchema),
    editTeamOwner,
);

teamOwnerRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    deleteTeamOwner,
);
