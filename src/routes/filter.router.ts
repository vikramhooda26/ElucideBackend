import { Router } from "express";
import { getFilteredAthletes } from "../controllers/athlete.controller.js";
import { getFilteredTeam } from "../controllers/team.controller.js";
import { getFilteredBrand } from "../controllers/brand.controller.js";
import { getFilteredLeague } from "../controllers/league.controller.js";
import { getFilteredStakeholders } from "../controllers/stakeholders.controller.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { filteredAthleteSchema } from "../schemas/athlete.schema.js";

export const filterRouter = Router();

filterRouter.get(
    "/athlete",
    validateSchema(filteredAthleteSchema),
    getFilteredAthletes,
);

filterRouter.get("/team", getFilteredTeam);

filterRouter.get("/brand", getFilteredBrand);

filterRouter.get("/league", getFilteredLeague);

filterRouter.get("/multiple", getFilteredStakeholders);
