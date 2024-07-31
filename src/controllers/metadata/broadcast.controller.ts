import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateBroadcastPartnerSchema,
    TEditBroadcastPartnerSchema,
} from "../../schemas/metadata/broadcast.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllBroadcastPartners = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const broadcastPartners = await prisma.dashapp_broadcastpartner.findMany({
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

    if (broadcastPartners.length < 1) {
        throw new NotFoundError("Broadcast partner data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        broadcastPartners.map((broadcastPartner) => ({
            broadcastPartnerId: broadcastPartner.id,
            broadcastPartnerName: broadcastPartner.name,
            createdDate: broadcastPartner.created_date,
            modifiedDate: broadcastPartner.modified_date,
            createdBy: {
                userId: broadcastPartner.created_by?.id,
                email: broadcastPartner.created_by?.email,
            },
            modifiedBy: {
                userId: broadcastPartner.modified_by?.id,
                email: broadcastPartner.modified_by?.email,
            },
            count: broadcastPartner._count,
        })),
    );
});

export const getBroadcastPartnerById = asyncHandler(async (req, res) => {
    const broadcastPartnerId = req.params.id;

    if (!broadcastPartnerId) {
        throw new BadRequestError("Broadcast partner ID not found");
    }

    const broadcastPartner = await prisma.dashapp_broadcastpartner.findUnique({
        where: { id: BigInt(broadcastPartnerId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!broadcastPartner) {
        throw new NotFoundError("This broadcast partner does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        broadcastPartnerId: broadcastPartner.id,
        broadcastPartnerName: broadcastPartner.name,
    });
});

export const createBroadcastPartner = asyncHandler(async (req, res) => {
    const { broadcastPartnerName, userId } =
        req.validatedData as TCreateBroadcastPartnerSchema;

    await prisma.dashapp_broadcastpartner.create({
        data: {
            name: broadcastPartnerName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.BROADCAST_PARTNER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Broadcast partner created",
    });
});

export const editBroadcastPartner = asyncHandler(async (req, res) => {
    const broadcastPartnerId = req.params.id;

    if (!broadcastPartnerId) {
        throw new BadRequestError("Broadcast partner ID not found");
    }

    const broadcastPartnerExists =
        await prisma.dashapp_broadcastpartner.findUnique({
            where: { id: BigInt(broadcastPartnerId) },
            select: { id: true },
        });

    if (!broadcastPartnerExists) {
        throw new NotFoundError("This broadcast partner does not exists");
    }

    const { broadcastPartnerName, userId } =
        req.validatedData as TEditBroadcastPartnerSchema;

    await prisma.dashapp_broadcastpartner.update({
        where: { id: BigInt(broadcastPartnerId) },
        data: {
            name: broadcastPartnerName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.BROADCAST_PARTNER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Broadcast partner updated",
    });
});

export const deleteBroadcastPartner = asyncHandler(async (req, res) => {
    const broadcastPartnerId = req.params.id;

    if (!broadcastPartnerId) {
        throw new BadRequestError("Broadcast partner ID not found");
    }

    const broadcastPartnerExists =
        await prisma.dashapp_broadcastpartner.findUnique({
            where: { id: BigInt(broadcastPartnerId) },
            select: { id: true },
        });

    if (!broadcastPartnerExists) {
        throw new NotFoundError("This broadcast partner does not exists");
    }

    await prisma.dashapp_broadcastpartner.delete({
        where: { id: BigInt(broadcastPartnerId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.BROADCAST_PARTNER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Broadcast partner deleted",
    });
});
