import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { TCreateCitySchema, TEditCitySchema } from "../../schemas/metadata/city.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllCities = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const cities = await prisma.dashapp_hqcity.findMany({
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

    if (cities.length < 1) {
        throw new NotFoundError("Cities data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        cities.map((city) => ({
            id: city.id,
            cityName: city.name,
            createdDate: city.created_date,
            modifiedDate: city.modified_date,
            createdBy: {
                userId: city.created_by?.id,
                email: city.created_by?.email,
            },
            modifiedBy: {
                userId: city.modified_by?.id,
                email: city.modified_by?.email,
            },
            count: city._count,
        })),
    );
});

export const getCityById = asyncHandler(async (req, res) => {
    const cityId = req.params.id;

    if (!cityId) {
        throw new BadRequestError("City ID not found");
    }

    const city = await prisma.dashapp_hqcity.findUnique({
        where: { id: BigInt(cityId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!city?.id) {
        throw new NotFoundError("This city does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: city.id,
        cityName: city.name,
    });
});

export const createCity = asyncHandler(async (req, res) => {
    const { cityName, userId } = req.validatedData as TCreateCitySchema;

    await prisma.dashapp_hqcity.create({
        data: {
            name: cityName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.CITY, true);

    res.status(STATUS_CODE.OK).json({
        message: "City created",
    });
});

export const editCity = asyncHandler(async (req, res) => {
    const cityId = req.params.id;

    if (!cityId) {
        throw new BadRequestError("City ID not found");
    }

    const cityExists = await prisma.dashapp_hqcity.findUnique({
        where: { id: BigInt(cityId) },
        select: { id: true },
    });

    if (!cityExists?.id) {
        throw new NotFoundError("This city does not exists");
    }

    const { cityName, userId } = req.validatedData as TEditCitySchema;

    await prisma.dashapp_hqcity.update({
        where: { id: BigInt(cityId) },
        data: {
            name: cityName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.CITY, true);

    res.status(STATUS_CODE.OK).json({
        message: "City updated",
    });
});

export const deleteCity = asyncHandler(async (req, res) => {
    const cityId = req.params.id;

    if (!cityId) {
        throw new BadRequestError("City ID not found");
    }

    const cityExists = await prisma.dashapp_hqcity.findUnique({
        where: { id: BigInt(cityId) },
        select: { id: true },
    });

    if (!cityExists?.id) {
        throw new NotFoundError("This city does not exists");
    }

    await prisma.dashapp_hqcity.delete({
        where: { id: BigInt(cityId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.CITY, true);

    res.status(STATUS_CODE.OK).json({
        message: "City deleted",
    });
});
