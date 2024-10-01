import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { TCreateNationalitySchema, TEditNationalitySchema } from "../../schemas/metadata/nationality.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllNationalities = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const nationalities = await prisma.dashapp_countries.findMany({
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

    if (nationalities.length < 1) {
        throw new NotFoundError("Nationalities data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        nationalities.map((nationality) => ({
            id: nationality.id,
            nationalityName: nationality.name,
            createdDate: nationality.created_date,
            modifiedDate: nationality.modified_date,
            createdBy: {
                userId: nationality.created_by?.id,
                email: nationality.created_by?.email,
            },
            modifiedBy: {
                userId: nationality.modified_by?.id,
                email: nationality.modified_by?.email,
            },
            count: nationality._count,
        })),
    );
});

export const getNationalityById = asyncHandler(async (req, res) => {
    const nationalityId = req.params.id;

    if (!nationalityId) {
        throw new BadRequestError("Nationality ID not found");
    }

    const nationality = await prisma.dashapp_countries.findUnique({
        where: { id: BigInt(nationalityId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!nationality?.id) {
        throw new NotFoundError("This nationality does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: nationality.id,
        nationalityName: nationality.name,
    });
});

export const createNationality = asyncHandler(async (req, res) => {
    const { nationality, userId } = req.validatedData as TCreateNationalitySchema;

    await prisma.dashapp_countries.create({
        data: {
            name: nationality,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.NATIONALITY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Nationality created",
    });
});

export const editNationality = asyncHandler(async (req, res) => {
    const nationalityId = req.params.id;

    if (!nationalityId) {
        throw new BadRequestError("Nationality ID not found");
    }

    const nationalityExits = await prisma.dashapp_countries.findUnique({
        where: { id: BigInt(nationalityId) },
        select: { id: true },
    });

    if (!nationalityExits?.id) {
        throw new NotFoundError("This nationality does not exists");
    }

    const { nationality, userId } = req.validatedData as TEditNationalitySchema;

    await prisma.dashapp_countries.update({
        where: { id: BigInt(nationalityId) },
        data: {
            name: nationality,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.NATIONALITY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Nationality updated",
    });
});

export const deleteNationality = asyncHandler(async (req, res) => {
    const nationalityId = req.params.id;

    if (!nationalityId) {
        throw new BadRequestError("Nationality ID not found");
    }

    const nationalityExists = await prisma.dashapp_countries.findUnique({
        where: { id: BigInt(nationalityId) },
        select: { id: true },
    });

    if (!nationalityExists?.id) {
        throw new NotFoundError("This nationality does not exists");
    }

    await prisma.dashapp_countries.delete({
        where: { id: BigInt(nationalityId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.NATIONALITY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Nationality deleted",
    });
});
