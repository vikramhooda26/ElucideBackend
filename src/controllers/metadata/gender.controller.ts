import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateGenderSchema,
    TEditGenderSchema,
} from "../../schemas/metadata/gender.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllGenders = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const genders = await prisma.dashapp_gender.findMany({
        select: {
            id: true,
            gender_is: true,
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

    if (genders.length < 1) {
        throw new NotFoundError("Genders data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        genders.map((gender) => ({
            genderId: gender.id,
            genderName: gender.gender_is,
            createdDate: gender.created_date,
            modifiedDate: gender.modified_date,
            createdBy: {
                userId: gender.created_by?.id,
                email: gender.created_by?.email,
            },
            modifiedBy: {
                userId: gender.modified_by?.id,
                email: gender.modified_by?.email,
            },
            count: gender._count,
        })),
    );
});

export const getGenderById = asyncHandler(async (req, res) => {
    const genderId = req.params.id;

    if (!genderId) {
        throw new BadRequestError("Asset ID not found");
    }

    const gender = await prisma.dashapp_gender.findUnique({
        where: { id: BigInt(genderId) },
        select: {
            id: true,
            gender_is: true,
        },
    });

    if (!gender) {
        throw new NotFoundError("This gender does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        genderId: gender.id,
        genderName: gender.gender_is,
    });
});

export const createGender = asyncHandler(async (req, res) => {
    const { gender, userId } = req.validatedData as TCreateGenderSchema;

    await prisma.dashapp_gender.create({
        data: {
            gender_is: gender,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.GENDER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Gender created",
    });
});

export const editGender = asyncHandler(async (req, res) => {
    const genderId = req.params.id;

    if (!genderId) {
        throw new BadRequestError("Gender ID not found");
    }

    const genderExists = await prisma.dashapp_gender.findUnique({
        where: { id: BigInt(genderId) },
        select: { id: true },
    });

    if (!genderExists) {
        throw new NotFoundError("This gender does not exists");
    }

    const { gender, userId } = req.validatedData as TEditGenderSchema;

    await prisma.dashapp_gender.update({
        where: { id: BigInt(genderId) },
        data: {
            gender_is: gender,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.GENDER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Gender updated",
    });
});

export const deleteGender = asyncHandler(async (req, res) => {
    const genderId = req.params.id;

    if (!genderId) {
        throw new BadRequestError("Gender ID not found");
    }

    const genderExists = await prisma.dashapp_gender.findUnique({
        where: { id: BigInt(genderId) },
        select: { id: true },
    });

    if (!genderExists) {
        throw new NotFoundError("This gender does not exists");
    }

    await prisma.dashapp_gender.delete({
        where: { id: BigInt(genderId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.GENDER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Gender deleted",
    });
});
