import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateNccsSchema,
    TEditNccsSchema,
} from "../../schemas/metadata/nccs.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllNccs = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const nccs = await prisma.dashapp_nccs.findMany({
        select: {
            id: true,
            nccs_class: true,
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

    if (nccs.length < 1) {
        throw new NotFoundError("Nccs data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        nccs.map((nccs) => ({
            nccsId: nccs.id,
            nccsName: nccs.nccs_class,
            createdDate: nccs.created_date,
            modifiedDate: nccs.modified_date,
            createdBy: {
                userId: nccs.created_by?.id,
                email: nccs.created_by?.email,
            },
            modifiedBy: {
                userId: nccs.modified_by?.id,
                email: nccs.modified_by?.email,
            },
            count: nccs._count,
        })),
    );
});

export const getNccsById = asyncHandler(async (req, res) => {
    const nccsId = req.params.id;

    if (!nccsId) {
        throw new BadRequestError("Nccs ID not found");
    }

    const nccs = await prisma.dashapp_nccs.findUnique({
        where: { id: BigInt(nccsId) },
        select: {
            id: true,
            nccs_class: true,
        },
    });

    if (!nccs) {
        throw new NotFoundError("This nccs does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        nccsId: nccs.id,
        nccsName: nccs.nccs_class,
    });
});

export const createNccs = asyncHandler(async (req, res) => {
    const { nccsClass, userId } = req.validatedData as TCreateNccsSchema;

    await prisma.dashapp_nccs.create({
        data: {
            nccs_class: nccsClass,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.NCCS, true);

    res.status(STATUS_CODE.OK).json({
        message: "Nccs created",
    });
});

export const editNccs = asyncHandler(async (req, res) => {
    const nccsId = req.params.id;

    if (!nccsId) {
        throw new BadRequestError("Nccs ID not found");
    }

    const nccsExits = await prisma.dashapp_nccs.findUnique({
        where: { id: BigInt(nccsId) },
        select: { id: true },
    });

    if (!nccsExits) {
        throw new NotFoundError("This nccs does not exists");
    }

    const { nccsClass, userId } = req.validatedData as TEditNccsSchema;

    await prisma.dashapp_nccs.update({
        where: { id: BigInt(nccsId) },
        data: {
            nccs_class: nccsClass,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.NCCS, true);

    res.status(STATUS_CODE.OK).json({
        message: "Nccs updated",
    });
});

export const deleteNccs = asyncHandler(async (req, res) => {
    const nccsId = req.params.id;

    if (!nccsId) {
        throw new BadRequestError("Nccs ID not found");
    }

    const nccsExists = await prisma.dashapp_nccs.findUnique({
        where: { id: BigInt(nccsId) },
        select: { id: true },
    });

    if (!nccsExists) {
        throw new NotFoundError("This nccs does not exists");
    }

    await prisma.dashapp_nccs.delete({
        where: { id: BigInt(nccsId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.NCCS, true);

    res.status(STATUS_CODE.OK).json({
        message: "Nccs deleted",
    });
});
