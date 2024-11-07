import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../lib/errors.js";
import { metadataStore } from "../../managers/MetadataManager.js";
import { TCreateCategorySchema, TEditCategorySchema } from "../../schemas/metadata/category.schema.js";

export const getAllCategories = expressAsyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const categories = await prisma.dashapp_category.findMany({
        select: {
            id: true,
            category: true,
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

    if (categories.length < 1) {
        throw new NotFoundError("Category data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        categories.map((category) => ({
            id: category.id,
            categoryName: category.category,
            createdDate: category.created_date,
            modifiedDate: category.modified_date,
            createdBy: {
                userId: category.created_by?.id,
                email: category.created_by?.email,
            },
            modifiedBy: {
                userId: category.modified_by?.id,
                email: category.modified_by?.email,
            },
            count: category._count,
        })),
    );
});

export const getCategoryById = expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.id;

    if (!categoryId) {
        throw new BadRequestError("Category ID not found");
    }

    const category = await prisma.dashapp_category.findUnique({
        where: { id: BigInt(categoryId) },
        select: {
            id: true,
            category: true,
            dashapp_subcategory: {
                select: {
                    id: true,
                    subcategory: true,
                },
            },
        },
    });

    if (!category?.id) {
        throw new NotFoundError("This category does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: category.id,
        categoryName: category.category,
        subcategories: category.dashapp_subcategory.map((subcategory) => ({
            id: subcategory.id,
            name: subcategory.subcategory,
        })),
    });
});

export const createCategory = expressAsyncHandler(async (req, res) => {
    const { categoryName, userId } = req.validatedData as TCreateCategorySchema;

    const categoryExists = await prisma.dashapp_category.findUnique({
        where: { category: categoryName },
        select: { id: true },
    });

    if (categoryExists) {
        throw new ConflictError("This main category already exists");
    }

    await prisma.dashapp_category.create({
        data: {
            category: categoryName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.MAIN_CATEGORY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Category created",
    });
});

export const editCategory = expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.id;

    if (!categoryId) {
        throw new BadRequestError("Category ID not found");
    }

    const categoryExists = await prisma.dashapp_category.findUnique({
        where: { id: BigInt(categoryId) },
        select: { id: true },
    });

    if (!categoryExists?.id) {
        throw new NotFoundError("This category does not exists");
    }

    const { categoryName, userId } = req.validatedData as TEditCategorySchema;

    await prisma.dashapp_category.update({
        where: { id: BigInt(categoryId) },
        data: {
            category: categoryName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.MAIN_CATEGORY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Category updated",
    });
});

export const deleteCategory = expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.id;

    if (!categoryId) {
        throw new BadRequestError("Category ID not found");
    }

    const categoryExists = await prisma.dashapp_category.findUnique({
        where: { id: BigInt(categoryId) },
        select: { id: true },
    });

    if (!categoryExists?.id) {
        throw new NotFoundError("This category does not exists");
    }

    await prisma.dashapp_category.delete({
        where: { id: BigInt(categoryId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.MAIN_CATEGORY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Category deleted",
    });
});
