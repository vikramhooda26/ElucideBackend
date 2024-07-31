import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createAgeRange,
    deleteAgeRange,
    editAgeRange,
    getAgeRangeById,
    getAllAgeRanges,
} from "../../controllers/metadata/age.controller.js";
import {
    createAgeRangeSchema,
    editAgeRangeSchema,
} from "../../schemas/metadata/age.schema.js";

export const ageRangeRouter = Router();

ageRangeRouter.get("/get-all", getAllAgeRanges);

ageRangeRouter.get("/:id", getAgeRangeById);

ageRangeRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createAgeRangeSchema),
    createAgeRange,
);

ageRangeRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editAgeRangeSchema),
    editAgeRange,
);

ageRangeRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    deleteAgeRange,
);
