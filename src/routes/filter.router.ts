import { Router } from "express";
import { getFilteredAthletes } from "../controllers/athlete.controller.js";
import { getFilteredBrand } from "../controllers/brand.controller.js";
import { getFilteredLeague } from "../controllers/league.controller.js";
import { getFilteredStakeholders } from "../controllers/stakeholders.controller.js";
import { getFilteredTeam } from "../controllers/team.controller.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { filteredAthleteSchema } from "../schemas/athlete.schema.js";
import { filteredBrandSchema } from "../schemas/brand.schema.js";
import { filteredLeagueSchema } from "../schemas/league.schema.js";
import { filteredStakeholdersSchema } from "../schemas/stakeholders.schema.js";
import { filteredTeamSchema } from "../schemas/team.schema.js";

export const filterRouter = Router();

filterRouter.post("/athlete", validateSchema(filteredAthleteSchema), getFilteredAthletes);

filterRouter.post("/team", validateSchema(filteredTeamSchema), getFilteredTeam);

filterRouter.post("/brand", validateSchema(filteredBrandSchema), getFilteredBrand);

filterRouter.post("/league", validateSchema(filteredLeagueSchema), getFilteredLeague);

filterRouter.post("/multiple", validateSchema(filteredStakeholdersSchema), getFilteredStakeholders);
