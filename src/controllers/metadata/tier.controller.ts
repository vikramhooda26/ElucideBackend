import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateTierSchema,
    TEditTierSchema,
} from "../../schemas/metadata/tier.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllTiers = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const tiers = await prisma.dashapp_tier.findMany({
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

    if (tiers.length < 1) {
        throw new NotFoundError("Tiers data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        tiers.map((tier) => ({
            tierId: tier.id,
            tierName: tier.name,
            createdDate: tier.created_date,
            modifiedDate: tier.modified_date,
            createdBy: {
                userId: tier.created_by?.id,
                email: tier.created_by?.email,
            },
            modifiedBy: {
                userId: tier.modified_by?.id,
                email: tier.modified_by?.email,
            },
            count: tier._count,
        })),
    );
});

export const getTierById = asyncHandler(async (req, res) => {
    const tierId = req.params.id;

    if (!tierId) {
        throw new BadRequestError("Tier ID not found");
    }

    const tier = await prisma.dashapp_tier.findUnique({
        where: { id: BigInt(tierId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!tier?.id) {
        throw new NotFoundError("This tier does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        tierId: tier.id,
        tierName: tier.name,
    });
});

export const createTier = asyncHandler(async (req, res) => {
    const { tierName, userId } = req.validatedData as TCreateTierSchema;

    await prisma.dashapp_tier.create({
        data: {
            name: tierName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TIER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Tier created",
    });
});

export const editTier = asyncHandler(async (req, res) => {
    const tierId = req.params.id;

    if (!tierId) {
        throw new BadRequestError("Tier ID not found");
    }

    const tierExits = await prisma.dashapp_tier.findUnique({
        where: { id: BigInt(tierId) },
        select: { id: true },
    });

    if (!tierExits?.id) {
        throw new NotFoundError("This tier does not exists");
    }

    const { tierName, userId } = req.validatedData as TEditTierSchema;

    await prisma.dashapp_tier.update({
        where: { id: BigInt(tierId) },
        data: {
            name: tierName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TIER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Tier updated",
    });
});

export const deleteTier = asyncHandler(async (req, res) => {
    const tierId = req.params.id;

    if (!tierId) {
        throw new BadRequestError("Tier ID not found");
    }

    const tierExists = await prisma.dashapp_tier.findUnique({
        where: { id: BigInt(tierId) },
        select: { id: true },
    });

    if (!tierExists?.id) {
        throw new NotFoundError("This tier does not exists");
    }

    await prisma.dashapp_tier.delete({
        where: { id: BigInt(tierId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TIER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Tier deleted",
    });
});
