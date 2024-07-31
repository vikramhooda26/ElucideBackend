import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createGender,
    deleteGender,
    editGender,
    getAllGenders,
    getGenderById,
} from "../../controllers/metadata/gender.controller.js";
import {
    createGenderSchema,
    editGenderSchema,
} from "../../schemas/metadata/gender.schema.js";

export const genderRouter = Router();

genderRouter.get("/get-all", getAllGenders);

genderRouter.get("/:id", getGenderById);

genderRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createGenderSchema),
    createGender,
);

genderRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editGenderSchema),
    editGender,
);

genderRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    deleteGender,
);
