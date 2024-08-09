import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateMarketingPlatformSchema,
    TEditMarketingPlatformSchema,
} from "../../schemas/metadata/marketing-platform.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllMarkingPlatforms = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const marketingPlatforms = await prisma.dashapp_marketingplatform.findMany({
        select: {
            id: true,
            platform: true,
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

    if (marketingPlatforms.length < 1) {
        throw new NotFoundError("Marketing platform data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        marketingPlatforms.map((marketingPlatform) => ({
            id: marketingPlatform.id,
            marketingPlatformName: marketingPlatform.platform,
            createdDate: marketingPlatform.created_date,
            modifiedDate: marketingPlatform.modified_date,
            createdBy: {
                userId: marketingPlatform.created_by?.id,
                email: marketingPlatform.created_by?.email,
            },
            modifiedBy: {
                userId: marketingPlatform.modified_by?.id,
                email: marketingPlatform.modified_by?.email,
            },
            count: marketingPlatform._count,
        })),
    );
});

export const getMarkingPlatformById = asyncHandler(async (req, res) => {
    const marketingPlatformId = req.params.id;

    if (!marketingPlatformId) {
        throw new BadRequestError("Marketing platform ID not found");
    }

    const marketingPlatform = await prisma.dashapp_marketingplatform.findUnique(
        {
            where: { id: BigInt(marketingPlatformId) },
            select: {
                id: true,
                platform: true,
            },
        },
    );

    if (!marketingPlatform?.id) {
        throw new NotFoundError("This marketing platform does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: marketingPlatform.id,
        marketingPlatformName: marketingPlatform.platform,
    });
});

export const createMarkingPlatform = asyncHandler(async (req, res) => {
    const { marketingPlatformName, userId } =
        req.validatedData as TCreateMarketingPlatformSchema;

    await prisma.dashapp_marketingplatform.create({
        data: {
            platform: marketingPlatformName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.MARKETING_PLATFORM, true);

    res.status(STATUS_CODE.OK).json({
        message: "Marketing platform created",
    });
});

export const editMarkingPlatform = asyncHandler(async (req, res) => {
    const marketingPlatformId = req.params.id;

    if (!marketingPlatformId) {
        throw new BadRequestError("Marketing platform ID not found");
    }

    const marketingPlatformExits =
        await prisma.dashapp_marketingplatform.findUnique({
            where: { id: BigInt(marketingPlatformId) },
            select: { id: true },
        });

    if (!marketingPlatformExits?.id) {
        throw new NotFoundError("This Marketing platform does not exists");
    }

    const { marketingPlatformName, userId } =
        req.validatedData as TEditMarketingPlatformSchema;

    await prisma.dashapp_marketingplatform.update({
        where: { id: BigInt(marketingPlatformId) },
        data: {
            platform: marketingPlatformName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.MARKETING_PLATFORM, true);

    res.status(STATUS_CODE.OK).json({
        message: "Marketing platform updated",
    });
});

export const deleteMarkingPlatform = asyncHandler(async (req, res) => {
    const marketingPlatformId = req.params.id;

    if (!marketingPlatformId) {
        throw new BadRequestError("Marketing platform ID not found");
    }

    const marketingPlatformExists =
        await prisma.dashapp_marketingplatform.findUnique({
            where: { id: BigInt(marketingPlatformId) },
            select: { id: true },
        });

    if (!marketingPlatformExists?.id) {
        throw new NotFoundError("This marketing platform does not exists");
    }

    await prisma.dashapp_marketingplatform.delete({
        where: { id: BigInt(marketingPlatformId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.MARKETING_PLATFORM, true);

    res.status(STATUS_CODE.OK).json({
        message: "Marketing platform deleted",
    });
});
