import { Router } from "express";
import { getFilteredAthletes } from "../controllers/athlete.controller.js";
import { getFilteredBrand } from "../controllers/brand.controller.js";
import { getFilteredLeague } from "../controllers/league.controller.js";
import { getFilteredStakeholders } from "../controllers/stakeholders.controller.js";
import { getFilteredTeam } from "../controllers/team.controller.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { filteredAthleteSchema } from "../schemas/athlete.schema.js";

export const filterRouter = Router();

filterRouter.post(
    "/athlete",
    validateSchema(filteredAthleteSchema),
    getFilteredAthletes,
);

filterRouter.post("/team", getFilteredTeam);

filterRouter.post("/brand", getFilteredBrand);

filterRouter.post("/league", getFilteredLeague);

filterRouter.post("/multiple", getFilteredStakeholders);
