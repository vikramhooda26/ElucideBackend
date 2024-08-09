import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateActiveCampaignSchema,
    TEditActiveCampaignSchema,
} from "../../schemas/metadata/campaign.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllActiveCampaigns = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const activeCampaign = await prisma.dashapp_activecampaigns.findMany({
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

    if (activeCampaign.length < 1) {
        throw new NotFoundError("Active Campaign data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        activeCampaign.map((campaign) => ({
            id: campaign.id,
            activeCampaignName: campaign.name,
            createdDate: campaign.created_date,
            modifiedDate: campaign.modified_date,
            createdBy: {
                userId: campaign.created_by?.id,
                email: campaign.created_by?.email,
            },
            modifiedBy: {
                userId: campaign.modified_by?.id,
                email: campaign.modified_by?.email,
            },
            count: campaign._count,
        })),
    );
});

export const getActiveCampaignById = asyncHandler(async (req, res) => {
    const activeCampaignId = req.params.id;

    if (!activeCampaignId) {
        throw new BadRequestError("Active Campaign ID not found");
    }

    const activeCampaign = await prisma.dashapp_activecampaigns.findUnique({
        where: {
            id: BigInt(activeCampaignId),
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (!activeCampaign?.id) {
        throw new NotFoundError("This campaign does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: activeCampaign.id,
        activeCampaignName: activeCampaign.name,
    });
});

export const createActiveCampaign = asyncHandler(async (req, res) => {
    const { activeCampaignName, userId } =
        req.validatedData as TCreateActiveCampaignSchema;

    await prisma.dashapp_activecampaigns.create({
        data: {
            name: activeCampaignName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.ACTIVE_CAMPAIGN, true);

    res.status(STATUS_CODE.OK).json({
        message: "Active campaign created",
    });
});

export const editActiveCampaign = asyncHandler(async (req, res) => {
    const activeCampaignId = req.params.id;

    if (!activeCampaignId) {
        throw new BadRequestError("Active Campaign ID not found");
    }

    const activeCampaignExists =
        await prisma.dashapp_activecampaigns.findUnique({
            where: {
                id: BigInt(activeCampaignId),
            },
            select: {
                id: true,
            },
        });

    if (!activeCampaignExists?.id) {
        throw new NotFoundError("This campaign does not exists");
    }

    const { activeCampaignName, userId } =
        req.validatedData as TEditActiveCampaignSchema;

    await prisma.dashapp_activecampaigns.update({
        where: { id: BigInt(activeCampaignId) },
        data: {
            name: activeCampaignName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.ACTIVE_CAMPAIGN, true);

    res.status(STATUS_CODE.OK).json({
        message: "Active campaign details updated",
    });
});

export const deleteActiveCampaign = asyncHandler(async (req, res) => {
    const activeCampaignId = req.params.id;

    if (!activeCampaignId) {
        throw new BadRequestError("Active Campaign ID not found");
    }

    const activeCampaign = await prisma.dashapp_agency.findUnique({
        where: { id: BigInt(activeCampaignId) },
        select: { id: true },
    });

    if (!activeCampaign?.id) {
        throw new NotFoundError("This Active Campaign does not exists");
    }

    await prisma.dashapp_activecampaigns.delete({
        where: { id: BigInt(activeCampaignId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.ACTIVE_CAMPAIGN, true);

    res.status(STATUS_CODE.OK).json({
        message: "Active Campaign deleted",
    });
});
