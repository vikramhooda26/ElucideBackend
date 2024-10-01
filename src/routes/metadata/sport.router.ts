import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createSport,
    deleteSport,
    editSport,
    getAllSports,
    getSportById,
} from "../../controllers/metadata/sport.controller.js";
import { createSportSchema, editSportSchema } from "../../schemas/metadata/sport.schema.js";

export const sportRouter = Router();

sportRouter.get("/get-all", getAllSports);

sportRouter.get("/:id", getSportById);

sportRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createSportSchema),
    createSport,
);

sportRouter.put("/edit/:id", roleMiddleware(["SUPER_ADMIN", "ADMIN"]), validateSchema(editSportSchema), editSport);

sportRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteSport);
