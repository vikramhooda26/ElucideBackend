import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { TCreateSportSchema, TEditSportSchema } from "../../schemas/metadata/sport.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllSports = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const sports = await prisma.dashapp_sport.findMany({
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

    if (sports.length < 1) {
        throw new NotFoundError("Sports data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        sports.map((sport) => ({
            id: sport.id,
            sportName: sport.name,
            createdDate: sport.created_date,
            modifiedDate: sport.modified_date,
            createdBy: {
                userId: sport.created_by?.id,
                email: sport.created_by?.email,
            },
            modifiedBy: {
                userId: sport.modified_by?.id,
                email: sport.modified_by?.email,
            },
            count: sport._count,
        })),
    );
});

export const getSportById = asyncHandler(async (req, res) => {
    const sportId = req.params.id;

    if (!sportId) {
        throw new BadRequestError("Sport ID not found");
    }

    const sport = await prisma.dashapp_sport.findUnique({
        where: { id: BigInt(sportId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!sport?.id) {
        throw new NotFoundError("This sport does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: sport.id,
        sportName: sport.name,
    });
});

export const createSport = asyncHandler(async (req, res) => {
    const { sportName, userId } = req.validatedData as TCreateSportSchema;

    await prisma.dashapp_sport.create({
        data: {
            name: sportName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.SPORT, true);

    res.status(STATUS_CODE.OK).json({
        message: "Sport created",
    });
});

export const editSport = asyncHandler(async (req, res) => {
    const sportId = req.params.id;

    if (!sportId) {
        throw new BadRequestError("Sport ID not found");
    }

    const sportExits = await prisma.dashapp_sport.findUnique({
        where: { id: BigInt(sportId) },
        select: { id: true },
    });

    if (!sportExits?.id) {
        throw new NotFoundError("This sport does not exists");
    }

    const { sportName, userId } = req.validatedData as TEditSportSchema;

    await prisma.dashapp_sport.update({
        where: { id: BigInt(sportId) },
        data: {
            name: sportName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.SPORT, true);

    res.status(STATUS_CODE.OK).json({
        message: "Sport updated",
    });
});

export const deleteSport = asyncHandler(async (req, res) => {
    const sportId = req.params.id;

    if (!sportId) {
        throw new BadRequestError("Sport ID not found");
    }

    const sportExists = await prisma.dashapp_sport.findUnique({
        where: { id: BigInt(sportId) },
        select: { id: true },
    });

    if (!sportExists?.id) {
        throw new NotFoundError("This sport does not exists");
    }

    await prisma.dashapp_sport.delete({
        where: { id: BigInt(sportId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.SPORT, true);

    res.status(STATUS_CODE.OK).json({
        message: "Sport deleted",
    });
});
