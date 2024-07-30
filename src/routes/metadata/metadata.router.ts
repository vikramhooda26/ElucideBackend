import { Router } from "express";
import { validateSchema } from "../../middleware/validate.middleware.js";
import { getAllMetadataSchema } from "../../schemas/metadata.schema.js";
import {
    fetchAllMetadata,
    fetchMetadataLastUpdated,
} from "../../controllers/metadata.controller.js";

export const metadataRouter = Router();

metadataRouter.get(
    "/get-all",
    validateSchema(getAllMetadataSchema),
    fetchAllMetadata,
);

metadataRouter.get("/last-updated", fetchMetadataLastUpdated);
