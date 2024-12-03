import { Router } from "express";
import {
    getAllBrands,
    getAllLeagues,
    getAllTeams,
    getAllAthletes,
    getAllSportsDealSummaries,
    getAllActivationSummaries,
} from "../../controllers/chatbot/chatbot.controller.js";

const chatbotRouter = Router();

chatbotRouter.get("/db-access/brands", getAllBrands);
chatbotRouter.get("/db-access/leagues", getAllLeagues);
chatbotRouter.get("/db-access/teams", getAllTeams);
chatbotRouter.get("/db-access/athletes", getAllAthletes);
chatbotRouter.get("/db-access/sports-deal-summaries", getAllSportsDealSummaries);
chatbotRouter.get("/db-access/activation-summaries", getAllActivationSummaries);

export { chatbotRouter };
