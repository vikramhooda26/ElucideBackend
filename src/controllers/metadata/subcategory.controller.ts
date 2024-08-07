import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateSubcategorySchema,
    TEditSubcategorySchema,
} from "../../schemas/metadata/subcategory.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllSubcategories = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const subcategories = await prisma.dashapp_subcategory.findMany({
        select: {
            id: true,
            subcategory: true,
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

    if (subcategories.length < 1) {
        throw new NotFoundError("Subcategory data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        subcategories.map((subcategory) => ({
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.subcategory,
            createdDate: subcategory.created_date,
            modifiedDate: subcategory.modified_date,
            createdBy: {
                userId: subcategory.created_by?.id,
                email: subcategory.created_by?.email,
            },
            modifiedBy: {
                userId: subcategory.modified_by?.id,
                email: subcategory.modified_by?.email,
            },
            count: subcategory._count,
        })),
    );
});

export const getsubcategoryById = asyncHandler(async (req, res) => {
    const subcategoryId = req.params.id;

    if (!subcategoryId) {
        throw new BadRequestError("Subcategory ID not found");
    }

    const subcategory = await prisma.dashapp_subcategory.findUnique({
        where: { id: BigInt(subcategoryId) },
        select: {
            id: true,
            subcategory: true,
        },
    });

    if (!subcategory?.id) {
        throw new NotFoundError("This subcategory does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.subcategory,
    });
});

export const createSubcategory = asyncHandler(async (req, res) => {
    const { subcategoryName, categoryId, userId } =
        req.validatedData as TCreateSubcategorySchema;

    await prisma.dashapp_subcategory.create({
        data: {
            subcategory: subcategoryName,
            dashapp_category: { connect: { id: BigInt(categoryId) } },
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.CATEGORY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Subcategory created",
    });
});

export const editSubcategory = asyncHandler(async (req, res) => {
    const subcategoryId = req.params.id;

    if (!subcategoryId) {
        throw new BadRequestError("Subcategory ID not found");
    }

    const subcategoryExists = await prisma.dashapp_subcategory.findUnique({
        where: { id: BigInt(subcategoryId) },
        select: { id: true },
    });

    if (!subcategoryExists?.id) {
        throw new NotFoundError("This subcategory does not exists");
    }

    const { subcategoryName, userId } =
        req.validatedData as TEditSubcategorySchema;

    await prisma.dashapp_subcategory.update({
        where: { id: BigInt(subcategoryId) },
        data: {
            subcategory: subcategoryName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.CATEGORY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Subcategory updated",
    });
});

export const deleteSubcategory = asyncHandler(async (req, res) => {
    const subcategoryId = req.params.id;

    if (!subcategoryId) {
        throw new BadRequestError("Subcategory ID not found");
    }

    const subcategoryExists = await prisma.dashapp_subcategory.findUnique({
        where: { id: BigInt(subcategoryId) },
        select: { id: true },
    });

    if (!subcategoryExists?.id) {
        throw new NotFoundError("This subcategory does not exists");
    }

    await prisma.dashapp_subcategory.delete({
        where: { id: BigInt(subcategoryId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.CATEGORY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Subcategory deleted",
    });
});
