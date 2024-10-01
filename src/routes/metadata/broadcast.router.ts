import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createBroadcastPartner,
    deleteBroadcastPartner,
    editBroadcastPartner,
    getAllBroadcastPartners,
    getBroadcastPartnerById,
} from "../../controllers/metadata/broadcast.controller.js";
import { createBroadcastPartnerSchema, editBroadcastPartnerSchema } from "../../schemas/metadata/broadcast.schema.js";

export const broadcastPartnerRouter = Router();

broadcastPartnerRouter.get("/get-all", getAllBroadcastPartners);

broadcastPartnerRouter.get("/:id", getBroadcastPartnerById);

broadcastPartnerRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createBroadcastPartnerSchema),
    createBroadcastPartner,
);

broadcastPartnerRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editBroadcastPartnerSchema),
    editBroadcastPartner,
);

broadcastPartnerRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteBroadcastPartner);
