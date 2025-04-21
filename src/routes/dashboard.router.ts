import { Router } from "express";
import {
  fetchAllMetrics,
  fetchAthletesMetrics,
  fetchBrandsMetrics,
  fetchLeaguesMetrics,
  fetchTeamsMetrics,
} from "../controllers/dashboard/dashboard.controller.js";

export const dashboardRouter = Router();

dashboardRouter.get("/master", fetchAllMetrics);

dashboardRouter.get("/athlete", fetchAthletesMetrics);

dashboardRouter.get("/league", fetchLeaguesMetrics);

dashboardRouter.get("/team", fetchTeamsMetrics);

dashboardRouter.get("/brand", fetchBrandsMetrics);
