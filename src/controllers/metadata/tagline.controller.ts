import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateTaglineSchema,
    TEditTaglineSchema,
} from "../../schemas/metadata/tagline.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllTaglines = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const taglines = await prisma.dashapp_taglines.findMany({
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

    if (taglines.length < 1) {
        throw new NotFoundError("Taglines data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        taglines.map((tagline) => ({
            taglineId: tagline.id,
            taglineName: tagline.name,
            createdDate: tagline.created_date,
            modifiedDate: tagline.modified_date,
            createdBy: {
                userId: tagline.created_by?.id,
                email: tagline.created_by?.email,
            },
            modifiedBy: {
                userId: tagline.modified_by?.id,
                email: tagline.modified_by?.email,
            },
            count: tagline._count,
        })),
    );
});

export const getTaglineById = asyncHandler(async (req, res) => {
    const taglineId = req.params.id;

    if (!taglineId) {
        throw new BadRequestError("Taglines ID not found");
    }

    const tagline = await prisma.dashapp_taglines.findUnique({
        where: { id: BigInt(taglineId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!tagline) {
        throw new NotFoundError("This tagline does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        taglineId: tagline.id,
        taglineName: tagline.name,
    });
});

export const createTagline = asyncHandler(async (req, res) => {
    const { taglineName, userId } = req.validatedData as TCreateTaglineSchema;

    await prisma.dashapp_taglines.create({
        data: {
            name: taglineName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TAGLINE, true);

    res.status(STATUS_CODE.OK).json({
        message: "Tagline created",
    });
});

export const editTagline = asyncHandler(async (req, res) => {
    const taglineId = req.params.id;

    if (!taglineId) {
        throw new BadRequestError("Tagline ID not found");
    }

    const taglineExits = await prisma.dashapp_taglines.findUnique({
        where: { id: BigInt(taglineId) },
        select: { id: true },
    });

    if (!taglineExits) {
        throw new NotFoundError("This tagline does not exists");
    }

    const { taglineName, userId } = req.validatedData as TEditTaglineSchema;

    await prisma.dashapp_taglines.update({
        where: { id: BigInt(taglineId) },
        data: {
            name: taglineName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TAGLINE, true);

    res.status(STATUS_CODE.OK).json({
        message: "Tagline updated",
    });
});

export const deleteTagline = asyncHandler(async (req, res) => {
    const taglineId = req.params.id;

    if (!taglineId) {
        throw new BadRequestError("Tagline ID not found");
    }

    const taglineExists = await prisma.dashapp_taglines.findUnique({
        where: { id: BigInt(taglineId) },
        select: { id: true },
    });

    if (!taglineExists) {
        throw new NotFoundError("This tagline does not exists");
    }

    await prisma.dashapp_taglines.delete({
        where: { id: BigInt(taglineId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TAGLINE, true);

    res.status(STATUS_CODE.OK).json({
        message: "Tagline deleted",
    });
});
