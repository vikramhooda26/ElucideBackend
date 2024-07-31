import { Router } from "express";
import {
    createActiveCampaign,
    deleteActiveCampaign,
    editActiveCampaign,
    getActiveCampaignById,
    getAllActiveCampaigns,
} from "../../controllers/metadata/campaign.controller.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createActiveCampaignSchema,
    editActiveCampaignSchema,
} from "../../schemas/metadata/campaign.schema.js";

export const activeCampaignRouter = Router();

activeCampaignRouter.get("/get-all", getAllActiveCampaigns);

activeCampaignRouter.get("/:id", getActiveCampaignById);

activeCampaignRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createActiveCampaignSchema),
    createActiveCampaign,
);

activeCampaignRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editActiveCampaignSchema),
    editActiveCampaign,
);

activeCampaignRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    deleteActiveCampaign,
);
