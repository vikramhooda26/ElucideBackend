import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createAgency,
    deleteAgency,
    editAgency,
    getAgencyById,
    getAllAgencies,
} from "../../controllers/metadata/agency.controller.js";
import {
    createAgencySchema,
    editAgencySchema,
} from "../../schemas/metadata/agency.schema.js";

export const agencyRouter = Router();

agencyRouter.get("/get-all", getAllAgencies);

agencyRouter.get("/:id", getAgencyById);

agencyRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createAgencySchema),
    createAgency,
);

agencyRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editAgencySchema),
    editAgency,
);

agencyRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    deleteAgency,
);
