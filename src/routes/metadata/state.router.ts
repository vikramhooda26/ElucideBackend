import { Router } from "express";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { validateSchema } from "../../middleware/validate.middleware.js";
import {
  createState,
  deleteState,
  editState,
  getAllStates,
  getStateById,
} from "../../controllers/metadata/state.controller.js";
import { createStateSchema, editStateSchema } from "../../schemas/metadata/state.schema.js";

export const stateRouter = Router();

stateRouter.get("/get-all", getAllStates);

stateRouter.get("/:id", getStateById);

stateRouter.post("/create", roleMiddleware(["SUPER_ADMIN"]), validateSchema(createStateSchema), createState);

stateRouter.put("/edit/:id", roleMiddleware(["SUPER_ADMIN"]), validateSchema(editStateSchema), editState);

stateRouter.delete("/delete/:id", roleMiddleware(["SUPER_ADMIN"]), deleteState);
