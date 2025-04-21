import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
  createKeyMarket,
  deleteKeyMarket,
  editKeyMarket,
  getAllkeyMarket,
  getKeyMarketById,
} from "../../controllers/metadata/market.controller.js";
import { createkeyMarketchema, editKeyMarketSchema } from "../../schemas/metadata/market.schema.js";

export const keyMarketRouter = Router();

keyMarketRouter.get("/get-all", getAllkeyMarket);

keyMarketRouter.get("/:id", getKeyMarketById);

keyMarketRouter.post("/create", roleMiddleware(["SUPER_ADMIN"]), validateSchema(createkeyMarketchema), createKeyMarket);

keyMarketRouter.put("/edit/:id", roleMiddleware(["SUPER_ADMIN"]), validateSchema(editKeyMarketSchema), editKeyMarket);

keyMarketRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteKeyMarket);
