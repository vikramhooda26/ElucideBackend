import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createNationality,
    deleteNationality,
    editNationality,
    getAllNationalities,
    getNationalityById,
} from "../../controllers/metadata/nationality.controller.js";
import {
    createNationalitySchema,
    editNationalitySchema,
} from "../../schemas/metadata/nationality.schema.js";

export const nationalityRouter = Router();

nationalityRouter.get("/get-all", getAllNationalities);

nationalityRouter.get("/:id", getNationalityById);

nationalityRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createNationalitySchema),
    createNationality,
);

nationalityRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editNationalitySchema),
    editNationality,
);

nationalityRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    deleteNationality,
);
