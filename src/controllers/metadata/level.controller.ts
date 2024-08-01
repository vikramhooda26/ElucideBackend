import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateLevelSchema,
    TEditLevelSchema,
} from "../../schemas/metadata/level.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllLevels = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const levels = await prisma.dashapp_level.findMany({
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

    if (levels.length < 1) {
        throw new NotFoundError("Levels data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        levels.map((level) => ({
            levelId: level.id,
            levelName: level.name,
            createdDate: level.created_date,
            modifiedDate: level.modified_date,
            createdBy: {
                userId: level.created_by?.id,
                email: level.created_by?.email,
            },
            modifiedBy: {
                userId: level.modified_by?.id,
                email: level.modified_by?.email,
            },
            count: level._count,
        })),
    );
});

export const getLevelById = asyncHandler(async (req, res) => {
    const levelId = req.params.id;

    if (!levelId) {
        throw new BadRequestError("Level ID not found");
    }

    const level = await prisma.dashapp_level.findUnique({
        where: { id: BigInt(levelId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!level) {
        throw new NotFoundError("This level does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        levelId: level.id,
        levelName: level.name,
    });
});

export const createLevel = asyncHandler(async (req, res) => {
    const { levelName, userId } = req.validatedData as TCreateLevelSchema;

    await prisma.dashapp_level.create({
        data: {
            name: levelName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.SPORTS_DEAL_SUMMARY_LEVEL, true);

    res.status(STATUS_CODE.OK).json({
        message: "Level created",
    });
});

export const editLevel = asyncHandler(async (req, res) => {
    const levelId = req.params.id;

    if (!levelId) {
        throw new BadRequestError("Level ID not found");
    }

    const levelExists = await prisma.dashapp_level.findUnique({
        where: { id: BigInt(levelId) },
        select: { id: true },
    });

    if (!levelExists) {
        throw new NotFoundError("This level does not exists");
    }

    const { levelName, userId } = req.validatedData as TEditLevelSchema;

    await prisma.dashapp_level.update({
        where: { id: BigInt(levelId) },
        data: {
            name: levelName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.SPORTS_DEAL_SUMMARY_LEVEL, true);

    res.status(STATUS_CODE.OK).json({
        message: "Level updated",
    });
});

export const deleteLevel = asyncHandler(async (req, res) => {
    const levelId = req.params.id;

    if (!levelId) {
        throw new BadRequestError("Level ID not found");
    }

    const levelExists = await prisma.dashapp_level.findUnique({
        where: { id: BigInt(levelId) },
        select: { id: true },
    });

    if (!levelExists) {
        throw new NotFoundError("This level does not exists");
    }

    await prisma.dashapp_level.delete({
        where: { id: BigInt(levelId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.SPORTS_DEAL_SUMMARY_LEVEL, true);

    res.status(STATUS_CODE.OK).json({
        message: "Level deleted",
    });
});
