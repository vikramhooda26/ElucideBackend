import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateTerritorySchema,
    TEditTerritorySchema,
} from "../../schemas/metadata/territory.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllTerritoryies = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const territories = await prisma.dashapp_territory.findMany({
        select: {
            id: true,
            name: true,
            created_date: true,
            modified_date: true,
            created_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            modified_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            _count: true,
        },
        orderBy: { modified_date: "desc" },
        take: Number.isNaN(Number(take)) ? undefined : Number(take),
        skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
    });

    if (territories.length < 1) {
        throw new NotFoundError("Territories data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        territories.map((territory) => ({
            id: territory.id,
            territoryName: territory.name,
            createdDate: territory.created_date,
            modifiedDate: territory.modified_date,
            createdBy: {
                userId: territory.created_by?.id,
                email: territory.created_by?.email,
            },
            modifiedBy: {
                userId: territory.modified_by?.id,
                email: territory.modified_by?.email,
            },
            count: territory._count,
        })),
    );
});

export const getTerritoryById = asyncHandler(async (req, res) => {
    const territoryId = req.params.id;

    if (!territoryId) {
        throw new BadRequestError("Territory ID not found");
    }

    const territory = await prisma.dashapp_territory.findUnique({
        where: { id: BigInt(territoryId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!territory?.id) {
        throw new NotFoundError("This territory does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: territory.id,
        territoryName: territory.name,
    });
});

export const createTerritory = asyncHandler(async (req, res) => {
    const { territoryName, userId } =
        req.validatedData as TCreateTerritorySchema;

    await prisma.dashapp_territory.create({
        data: {
            name: territoryName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TERTIARY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Territory created",
    });
});

export const editTerritory = asyncHandler(async (req, res) => {
    const territoryId = req.params.id;

    if (!territoryId) {
        throw new BadRequestError("Territory ID not found");
    }

    const territoryExits = await prisma.dashapp_territory.findUnique({
        where: { id: BigInt(territoryId) },
        select: { id: true },
    });

    if (!territoryExits?.id) {
        throw new NotFoundError("This territory does not exists");
    }

    const { territoryName, userId } = req.validatedData as TEditTerritorySchema;

    await prisma.dashapp_territory.update({
        where: { id: BigInt(territoryId) },
        data: {
            name: territoryName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TERTIARY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Territory updated",
    });
});

export const deleteTerritory = asyncHandler(async (req, res) => {
    const territoryId = req.params.id;

    if (!territoryId) {
        throw new BadRequestError("Territory ID not found");
    }

    const territoryExists = await prisma.dashapp_territory.findUnique({
        where: { id: BigInt(territoryId) },
        select: { id: true },
    });

    if (!territoryExists?.id) {
        throw new NotFoundError("This territory does not exists");
    }

    await prisma.dashapp_territory.delete({
        where: { id: BigInt(territoryId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TERTIARY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Territory deleted",
    });
});
