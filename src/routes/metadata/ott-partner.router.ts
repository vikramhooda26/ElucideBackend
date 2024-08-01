import { Router } from "express";
import { validateSchema } from "../../middleware/validate.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import {
    createOttPartner,
    deleteOttPartner,
    editOttPartner,
    getAllOttPartners,
    getOttPartnerById,
} from "../../controllers/metadata/ott-partner.controller.js";
import {
    createOttPartnerSchema,
    editOttPartnerSchema,
} from "../../schemas/metadata/ott-partner.schema.js";

export const ottPartnerRouter = Router();

ottPartnerRouter.get("/get-all", getAllOttPartners);

ottPartnerRouter.get("/:id", getOttPartnerById);

ottPartnerRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createOttPartnerSchema),
    createOttPartner,
);

ottPartnerRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editOttPartnerSchema),
    editOttPartner,
);

ottPartnerRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    deleteOttPartner,
);
