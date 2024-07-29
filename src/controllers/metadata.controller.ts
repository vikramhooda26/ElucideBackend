import { Request, Response } from "express";
import { prisma } from "../db/index.js";
import { metadataStore } from "../managers/MetadataManager.js";
import { STATUS_CODE } from "../lib/constants.js";

export const fetchAllMetadata = async (req: Request, res: Response) => {
    metadataStore.setLastUpdated(new Date());

    res.status(STATUS_CODE.OK).json();
};
