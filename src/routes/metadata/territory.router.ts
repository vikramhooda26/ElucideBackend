import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createTerritory,
    deleteTerritory,
    editTerritory,
    getAllTerritoryies,
    getTerritoryById,
} from "../../controllers/metadata/territory.controller.js";
import {
    createTerritorySchema,
    editTerritorySchema,
} from "../../schemas/metadata/territory.schema.js";

export const territoryRouter = Router();

territoryRouter.get("/get-all", getAllTerritoryies);

territoryRouter.get("/:id", getTerritoryById);

territoryRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(createTerritorySchema),
    createTerritory,
);

territoryRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(editTerritorySchema),
    editTerritory,
);

territoryRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    deleteTerritory,
);
