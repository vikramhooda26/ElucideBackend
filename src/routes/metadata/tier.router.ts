import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createTier,
    deleteTier,
    editTier,
    getAllTiers,
    getTierById,
} from "../../controllers/metadata/tier.controller.js";
import {
    createTierSchema,
    editTierSchema,
} from "../../schemas/metadata/tier.schema.js";

export const tierRouter = Router();

tierRouter.get("/get-all", getAllTiers);

tierRouter.get("/:id", getTierById);

tierRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(createTierSchema),
    createTier,
);

tierRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN"]),
    validateSchema(editTierSchema),
    editTier,
);

tierRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteTier);
