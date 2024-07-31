import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createCity,
    deleteCity,
    editCity,
    getAllCities,
    getCityById,
} from "../../controllers/metadata/city.controller.js";
import {
    createCitySchema,
    editCitySchema,
} from "../../schemas/metadata/city.schema.js";

export const cityRouter = Router();

cityRouter.get("/get-all", getAllCities);

cityRouter.get("/:id", getCityById);

cityRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createCitySchema),
    createCity,
);

cityRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    validateSchema(editCitySchema),
    editCity,
);

cityRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    deleteCity,
);
