import { Router } from "express";
import { getLeagueById } from "../controllers/league.controller.js";

export const leagueRouter = Router();

leagueRouter.get("/:id", getLeagueById);
