import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateAssetSchema,
    TEditAssetSchema,
} from "../../schemas/metadata/asset.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllAssets = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const assets = await prisma.dashapp_assets.findMany({
        select: {
            id: true,
            asset: true,
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

    if (assets.length < 1) {
        throw new NotFoundError("Assets data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        assets.map((asset) => ({
            assetId: asset.id,
            assetName: asset.asset,
            createdDate: asset.created_date,
            modifiedDate: asset.modified_date,
            createdBy: {
                userId: asset.created_by?.id,
                email: asset.created_by?.email,
            },
            modifiedBy: {
                userId: asset.modified_by?.id,
                email: asset.modified_by?.email,
            },
            count: asset._count,
        })),
    );
});

export const getAssetById = asyncHandler(async (req, res) => {
    const assetId = req.params.id;

    if (!assetId) {
        throw new BadRequestError("Asset ID not found");
    }

    const asset = await prisma.dashapp_assets.findUnique({
        where: { id: BigInt(assetId) },
        select: {
            id: true,
            asset: true,
        },
    });

    if (!asset) {
        throw new NotFoundError("This asset does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        assetId: asset.id,
        assetName: asset.asset,
    });
});

export const createAsset = asyncHandler(async (req, res) => {
    const { assetName, userId } = req.validatedData as TCreateAssetSchema;

    await prisma.dashapp_assets.create({
        data: {
            asset: assetName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.ASSET, true);

    res.status(STATUS_CODE.OK).json({
        message: "Asset created",
    });
});

export const editAsset = asyncHandler(async (req, res) => {
    const assetId = req.params.id;

    if (!assetId) {
        throw new BadRequestError("Asset ID not found");
    }

    const assetExits = await prisma.dashapp_assets.findUnique({
        where: { id: BigInt(assetId) },
        select: { id: true },
    });

    if (!assetExits) {
        throw new NotFoundError("This asset does not exists");
    }

    const { assetName, userId } = req.validatedData as TEditAssetSchema;

    await prisma.dashapp_assets.update({
        where: { id: BigInt(assetId) },
        data: {
            asset: assetName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.ASSET, true);

    res.status(STATUS_CODE.OK).json({
        message: "Asset updated",
    });
});

export const deleteAsset = asyncHandler(async (req, res) => {
    const assetId = req.params.id;

    if (!assetId) {
        throw new BadRequestError("Asset ID not found");
    }

    const assetExists = await prisma.dashapp_assets.findUnique({
        where: { id: BigInt(assetId) },
        select: { id: true },
    });

    if (!assetExists) {
        throw new NotFoundError("This asset does not exists");
    }

    await prisma.dashapp_assets.delete({
        where: { id: BigInt(assetId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.ASSET, true);

    res.status(STATUS_CODE.OK).json({
        message: "Asset deleted",
    });
});
