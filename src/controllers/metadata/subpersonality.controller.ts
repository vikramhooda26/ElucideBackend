import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { metadataStore } from "../../managers/MetadataManager.js";
import { TCreateSubpersonalitySchema, TEditSubpersonalitySchema } from "../../schemas/metadata/subpersonality.js";

export const getAllSubpersonalities = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const subpersonalities = await prisma.dashapp_subpersonality.findMany({
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

    if (subpersonalities.length < 1) {
        throw new NotFoundError("Sub personalities data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        subpersonalities.map((subpersonality) => ({
            id: subpersonality.id,
            subpersonalityName: subpersonality.name,
            createdDate: subpersonality.created_date,
            modifiedDate: subpersonality.modified_date,
            createdBy: {
                userId: subpersonality.created_by?.id,
                email: subpersonality.created_by?.email,
            },
            modifiedBy: {
                userId: subpersonality.modified_by?.id,
                email: subpersonality.modified_by?.email,
            },
            count: subpersonality._count,
        })),
    );
});

export const getSubpersonalityById = asyncHandler(async (req, res) => {
    const subpersonalityId = req.params.id;

    if (!subpersonalityId) {
        throw new BadRequestError("Sub personality ID not found");
    }

    const subpersonality = await prisma.dashapp_subpersonality.findUnique({
        where: { id: BigInt(subpersonalityId) },
        select: {
            id: true,
            name: true,
            dashapp_mainpersonality: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!subpersonality?.id) {
        throw new NotFoundError("This sub personality does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: subpersonality.id,
        subpersonalityName: subpersonality.name,
        personality: {
            id: subpersonality.dashapp_mainpersonality.id,
            name: subpersonality.dashapp_mainpersonality.name,
        },
    });
});

export const createSubpersonality = asyncHandler(async (req, res) => {
    const { mainPersonalityId, subpersonalityName, userId } = req.validatedData as TCreateSubpersonalitySchema;

    await prisma.dashapp_subpersonality.create({
        data: {
            name: subpersonalityName,
            dashapp_mainpersonality: {
                connect: { id: BigInt(mainPersonalityId) },
            },
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.PERSONALITY_TRAIT, true);

    res.status(STATUS_CODE.OK).json({
        message: "Sub personality created",
    });
});

export const editSubpersonality = asyncHandler(async (req, res) => {
    const subpersonalityId = req.params.id;

    if (!subpersonalityId) {
        throw new BadRequestError("Sub personality ID not found");
    }

    const subpersonalityExits = await prisma.dashapp_subpersonality.findUnique({
        where: { id: BigInt(subpersonalityId) },
        select: { id: true },
    });

    if (!subpersonalityExits?.id) {
        throw new NotFoundError("This sub personality does not exists");
    }

    const { mainPersonalityId, subpersonalityName, userId } = req.validatedData as TEditSubpersonalitySchema;

    await prisma.dashapp_subpersonality.update({
        where: { id: BigInt(subpersonalityId) },
        data: {
            name: subpersonalityName,
            modified_by: { connect: { id: BigInt(userId) } },
            dashapp_mainpersonality: mainPersonalityId
                ? {
                      connect: { id: BigInt(mainPersonalityId) },
                  }
                : undefined,
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.PERSONALITY_TRAIT, true);

    res.status(STATUS_CODE.OK).json({
        message: "Sub personality updated",
    });
});

export const deleteSubpersonality = asyncHandler(async (req, res) => {
    const subpersonalityId = req.params.id;

    if (!subpersonalityId) {
        throw new BadRequestError("Sub personality ID not found");
    }

    const subpersonalityExists = await prisma.dashapp_subpersonality.findUnique({
        where: { id: BigInt(subpersonalityId) },
        select: { id: true },
    });

    if (!subpersonalityExists?.id) {
        throw new NotFoundError("This sub personality does not exists");
    }

    await prisma.dashapp_subpersonality.delete({
        where: { id: BigInt(subpersonalityId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.PERSONALITY_TRAIT, true);

    res.status(STATUS_CODE.OK).json({
        message: "Sub personality deleted",
    });
});
