import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { metadataStore } from "../../managers/MetadataManager.js";
import { TCreatePersonalitySchema, TEditPersonalitySchema } from "../../schemas/metadata/personality.schema.js";

export const getAllPersonalities = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const personalities = await prisma.dashapp_mainpersonality.findMany({
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

    if (personalities.length < 1) {
        throw new NotFoundError("Personalities data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        personalities.map((personality) => ({
            id: personality.id,
            personalityName: personality.name,
            createdDate: personality.created_date,
            modifiedDate: personality.modified_date,
            createdBy: {
                userId: personality.created_by?.id,
                email: personality.created_by?.email,
            },
            modifiedBy: {
                userId: personality.modified_by?.id,
                email: personality.modified_by?.email,
            },
            count: personality._count,
        })),
    );
});

export const getPersonalityById = asyncHandler(async (req, res) => {
    const personalityId = req.params.id;

    if (!personalityId) {
        throw new BadRequestError("Personality ID not found");
    }

    const personality = await prisma.dashapp_mainpersonality.findUnique({
        where: { id: BigInt(personalityId) },
        select: {
            id: true,
            name: true,
            dashapp_subpersonality: {
                select: { id: true, name: true },
            },
        },
    });

    if (!personality?.id) {
        throw new NotFoundError("This personality does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: personality.id,
        personalityName: personality.name,
        subpersonalities: personality.dashapp_subpersonality.map((subpersonality) => ({
            id: subpersonality.id,
            name: subpersonality.name,
        })),
    });
});

export const createPersonality = asyncHandler(async (req, res) => {
    const { personalityName, userId } = req.validatedData as TCreatePersonalitySchema;

    await prisma.dashapp_mainpersonality.create({
        data: {
            name: personalityName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.PERSONALITY_TRAIT, true);

    res.status(STATUS_CODE.OK).json({
        message: "Personality created",
    });
});

export const editPersonality = asyncHandler(async (req, res) => {
    const personalityId = req.params.id;

    if (!personalityId) {
        throw new BadRequestError("Personality ID not found");
    }

    const personalityExists = await prisma.dashapp_mainpersonality.findUnique({
        where: { id: BigInt(personalityId) },
        select: { id: true },
    });

    if (!personalityExists?.id) {
        throw new NotFoundError("This personality does not exists");
    }

    const { personalityName, userId } = req.validatedData as TEditPersonalitySchema;

    await prisma.dashapp_mainpersonality.update({
        where: { id: BigInt(personalityId) },
        data: {
            name: personalityName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.PERSONALITY_TRAIT, true);

    res.status(STATUS_CODE.OK).json({
        message: "Personality updated",
    });
});

export const deletePersonality = asyncHandler(async (req, res) => {
    const personalityId = req.params.id;

    if (!personalityId) {
        throw new BadRequestError("Personality ID not found");
    }

    const personalityExists = await prisma.dashapp_mainpersonality.findUnique({
        where: { id: BigInt(personalityId) },
        select: { id: true },
    });

    if (!personalityExists?.id) {
        throw new NotFoundError("This personality does not exists");
    }

    await prisma.dashapp_mainpersonality.delete({
        where: { id: BigInt(personalityId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.PERSONALITY_TRAIT, true);

    res.status(STATUS_CODE.OK).json({
        message: "Personality deleted",
    });
});
