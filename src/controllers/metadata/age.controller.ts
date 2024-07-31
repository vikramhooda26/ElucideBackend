import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateAgeRangeSchema,
    TEditAgeRangeSchema,
} from "../../schemas/metadata/age.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

const validateAgeRange = (ageRange: string): boolean => {
    if (ageRange.includes("+")) {
        const parts = ageRange.split("+");
        const [minAge, plus] = parts;
        if (
            parts.length !== 2 ||
            plus !== "" ||
            Number.isNaN(Number(minAge)) ||
            Number(minAge) < 0
        ) {
            return false;
        }
        return true;
    }
    if (ageRange.includes("-")) {
        const parts = ageRange.split("-");
        const [minAge, maxAge] = parts;
        if (
            parts.length !== 2 ||
            Number.isNaN(Number(maxAge)) ||
            Number.isNaN(Number(minAge)) ||
            Number(minAge) < 0 ||
            Number(maxAge) < 0
        ) {
            return false;
        }
        return true;
    }
    return false;
};

export const getAllAgeRanges = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const ageRanges = await prisma.dashapp_age.findMany({
        select: {
            id: true,
            age_range: true,
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

    if (ageRanges.length < 1) {
        throw new NotFoundError("Age range data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        ageRanges.map((range) => ({
            id: range.id,
            ageRange: range.age_range,
            createdDate: range.created_date,
            modifiedDate: range.modified_date,
            createdBy: {
                userId: range.created_by?.id,
                email: range.created_by?.email,
            },
            modifiedBy: {
                userId: range.modified_by?.id,
                email: range.modified_by?.email,
            },
            count: range._count,
        })),
    );
});

export const getAgeRangeById = asyncHandler(async (req, res) => {
    const ageRangeId = req.params.id;

    if (!ageRangeId) {
        throw new BadRequestError("Age range ID not found");
    }

    const ageRange = await prisma.dashapp_age.findUnique({
        where: { id: BigInt(ageRangeId) },
        select: {
            id: true,
            age_range: true,
        },
    });

    if (!ageRange) {
        throw new NotFoundError("This age range does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        ageRangeId: ageRange.id,
        ageRange: ageRange.age_range,
    });
});

export const createAgeRange = asyncHandler(async (req, res) => {
    const { ageRange, userId } = req.validatedData as TCreateAgeRangeSchema;

    const isAgeRangeValid = validateAgeRange(ageRange);

    if (!isAgeRangeValid) {
        throw new BadRequestError("Invalid age range format");
    }

    await prisma.dashapp_age.create({
        data: {
            age_range: ageRange,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.AGE, true);

    res.status(STATUS_CODE.OK).json({
        message: "Age range created",
    });
});

export const editAgeRange = asyncHandler(async (req, res) => {
    const ageRangeId = req.params.id;

    if (!ageRangeId) {
        throw new BadRequestError("Age range ID not found");
    }

    const ageRangeExists = await prisma.dashapp_age.findUnique({
        where: { id: BigInt(ageRangeId) },
        select: { id: true },
    });

    if (!ageRangeExists) {
        throw new NotFoundError("This age range does not exists");
    }

    const { ageRange, userId } = req.validatedData as TEditAgeRangeSchema;

    const isAgeRangeValid = validateAgeRange(ageRange);

    if (!isAgeRangeValid) {
        throw new BadRequestError("Invalid age range format");
    }

    await prisma.dashapp_age.update({
        where: { id: BigInt(ageRangeId) },
        data: {
            age_range: ageRange,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.AGE, true);

    res.status(STATUS_CODE.OK).json({
        message: "Age range updated",
    });
});

export const deleteAgeRange = asyncHandler(async (req, res) => {
    const ageRangeId = req.params.id;

    if (!ageRangeId) {
        throw new BadRequestError("Age range ID not found");
    }

    const ageRangeExists = await prisma.dashapp_age.findUnique({
        where: { id: BigInt(ageRangeId) },
        select: { id: true },
    });

    if (!ageRangeExists) {
        throw new NotFoundError("This age range does not exists");
    }

    await prisma.dashapp_age.delete({
        where: { id: BigInt(ageRangeId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.AGE, true);

    res.status(STATUS_CODE.OK).json({
        message: "Age range deleted",
    });
});
