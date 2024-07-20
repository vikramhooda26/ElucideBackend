import { Router } from "express";
import {
    createBrand,
    editBrand,
    getAllBrands,
    getBrandById,
    deleteBrand,
} from "../controllers/brand.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

export const brandRouter = Router();

brandRouter.get("/", getAllBrands);

brandRouter.get("/:id", getBrandById);

brandRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    createBrand,
);

brandRouter.put(
    "/edit/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    editBrand,
);

brandRouter.delete(
    "/delete/:id",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    deleteBrand,
);
