import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createParentOrg,
    deleteParentOrg,
    editParentOrg,
    getAllParentOrgs,
    getParentOrgById,
} from "../../controllers/metadata/parent-org.controller.js";
import { createParentOrgSchema, editParentOrgSchema } from "../../schemas/metadata/parent-org.schema.js";

export const parentOrgRouter = Router();

parentOrgRouter.get("/get-all", getAllParentOrgs);

parentOrgRouter.get("/:id", getParentOrgById);

parentOrgRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createParentOrgSchema),
    createParentOrg,
);

parentOrgRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editParentOrgSchema),
    editParentOrg,
);

parentOrgRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteParentOrg);
