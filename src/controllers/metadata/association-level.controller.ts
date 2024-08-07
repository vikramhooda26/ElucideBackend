import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateAssociationLevelSchema,
    TEditAssociationLevelSchema,
} from "../../schemas/metadata/association-level.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllAssociationLevels = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const associationLevels = await prisma.association_level.findMany({
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

    if (associationLevels.length < 1) {
        throw new NotFoundError("Association levels data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        associationLevels.map((associationLevel) => ({
            associationLevelId: associationLevel.id,
            associationLevelName: associationLevel.name,
            createdDate: associationLevel.created_date,
            modifiedDate: associationLevel.modified_date,
            createdBy: {
                userId: associationLevel.created_by?.id,
                email: associationLevel.created_by?.email,
            },
            modifiedBy: {
                userId: associationLevel.modified_by?.id,
                email: associationLevel.modified_by?.email,
            },
            count: associationLevel._count,
        })),
    );
});

export const getAssociationLevelById = asyncHandler(async (req, res) => {
    const associationLevelId = req.params.id;

    if (!associationLevelId) {
        throw new BadRequestError("Association level ID not found");
    }

    const associationLevel = await prisma.association_level.findUnique({
        where: { id: BigInt(associationLevelId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!associationLevel?.id) {
        throw new NotFoundError("This association level does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        associationLevelId: associationLevel.id,
        associationLevelName: associationLevel.name,
    });
});

export const createAssociationLevel = asyncHandler(async (req, res) => {
    const { associationLevelName, userId } =
        req.validatedData as TCreateAssociationLevelSchema;

    await prisma.association_level.create({
        data: {
            name: associationLevelName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.ASSOCIATION_LEVELS, true);

    res.status(STATUS_CODE.OK).json({
        message: "Association level created",
    });
});

export const editAssociationLevel = asyncHandler(async (req, res) => {
    const associationLevelId = req.params.id;

    if (!associationLevelId) {
        throw new BadRequestError("Association level ID not found");
    }

    const associationLevelExits = await prisma.association_level.findUnique({
        where: { id: BigInt(associationLevelId) },
        select: { id: true },
    });

    if (!associationLevelExits?.id) {
        throw new NotFoundError("This association level does not exists");
    }

    const { associationLevelName, userId } =
        req.validatedData as TEditAssociationLevelSchema;

    await prisma.association_level.update({
        where: { id: BigInt(associationLevelId) },
        data: {
            name: associationLevelName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.ASSOCIATION_LEVELS, true);

    res.status(STATUS_CODE.OK).json({
        message: "Association level updated",
    });
});

export const deleteAssociationLevel = asyncHandler(async (req, res) => {
    const associationLevelId = req.params.id;

    if (!associationLevelId) {
        throw new BadRequestError("Association level ID not found");
    }

    const associationLevelExists = await prisma.association_level.findUnique({
        where: { id: BigInt(associationLevelId) },
        select: { id: true },
    });

    if (!associationLevelExists?.id) {
        throw new NotFoundError("This association level does not exists");
    }

    await prisma.association_level.delete({
        where: { id: BigInt(associationLevelId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.ASSOCIATION_LEVELS, true);

    res.status(STATUS_CODE.OK).json({
        message: "Association level deleted",
    });
});
