import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
    createAsset,
    deleteAsset,
    editAsset,
    getAllAssets,
    getAssetById,
} from "../../controllers/metadata/asset.controller.js";
import { createAssetSchema, editAssetSchema } from "../../schemas/metadata/asset.schema.js";

export const assetRouter = Router();

assetRouter.get("/get-all", getAllAssets);

assetRouter.get("/:id", getAssetById);

assetRouter.post(
    "/create",
    roleMiddleware(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    validateSchema(createAssetSchema),
    createAsset,
);

assetRouter.put("/edit/:id", roleMiddleware(["SUPER_ADMIN", "ADMIN"]), validateSchema(editAssetSchema), editAsset);

assetRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteAsset);
