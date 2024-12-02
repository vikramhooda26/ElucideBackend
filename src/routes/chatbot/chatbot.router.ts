import { Router } from "express";
import { getDatabase } from "../../controllers/chatbot/chatbot.controller.js";

const chatbotRouter = Router();

chatbotRouter.get("/database", getDatabase);

export { chatbotRouter };
