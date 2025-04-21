import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { STATUS_CODE } from "../lib/constants.js";
import asyncHandler from "express-async-handler";

export const validateSchema = (schema: ZodSchema) => {
  return asyncHandler((req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(STATUS_CODE.BAD_REQUEST).json(validationResult.error.format());
      return;
    }

    req.validatedData = validationResult.data;
    next();
  });
};
