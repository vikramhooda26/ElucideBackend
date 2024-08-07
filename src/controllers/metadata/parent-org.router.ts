import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateParentOrgSchema,
    TEditParentOrgSchema,
} from "../../schemas/metadata/parent-org.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllParentOrgs = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const parentOrgs = await prisma.dashapp_parentorg.findMany({
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

    if (parentOrgs.length < 1) {
        throw new NotFoundError("Parent Organizations data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        parentOrgs.map((parentOrg) => ({
            parentOrgId: parentOrg.id,
            parentOrgName: parentOrg.name,
            createdDate: parentOrg.created_date,
            modifiedDate: parentOrg.modified_date,
            createdBy: {
                userId: parentOrg.created_by?.id,
                email: parentOrg.created_by?.email,
            },
            modifiedBy: {
                userId: parentOrg.modified_by?.id,
                email: parentOrg.modified_by?.email,
            },
            count: parentOrg._count,
        })),
    );
});

export const getParentOrgById = asyncHandler(async (req, res) => {
    const parentOrgId = req.params.id;

    if (!parentOrgId) {
        throw new BadRequestError("Parent Organization ID not found");
    }

    const parentOrg = await prisma.dashapp_parentorg.findUnique({
        where: { id: BigInt(parentOrgId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!parentOrg?.id) {
        throw new NotFoundError("This parent Organization does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        parentOrgId: parentOrg.id,
        parentOrgName: parentOrg.name,
    });
});

export const createParentOrg = asyncHandler(async (req, res) => {
    const { parentOrgName, userId } =
        req.validatedData as TCreateParentOrgSchema;

    await prisma.dashapp_parentorg.create({
        data: {
            name: parentOrgName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.PARENT_ORG, true);

    res.status(STATUS_CODE.OK).json({
        message: "Parent organization created",
    });
});

export const editParentOrg = asyncHandler(async (req, res) => {
    const parentOrgId = req.params.id;

    if (!parentOrgId) {
        throw new BadRequestError("Parent organization ID not found");
    }

    const parentOrgExits = await prisma.dashapp_parentorg.findUnique({
        where: { id: BigInt(parentOrgId) },
        select: { id: true },
    });

    if (!parentOrgExits?.id) {
        throw new NotFoundError("This parent organization does not exists");
    }

    const { parentOrgName, userId } = req.validatedData as TEditParentOrgSchema;

    await prisma.dashapp_parentorg.update({
        where: { id: BigInt(parentOrgId) },
        data: {
            name: parentOrgName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.PARENT_ORG, true);

    res.status(STATUS_CODE.OK).json({
        message: "Parent organization updated",
    });
});

export const deleteParentOrg = asyncHandler(async (req, res) => {
    const parentOrgId = req.params.id;

    if (!parentOrgId) {
        throw new BadRequestError("Parent organization ID not found");
    }

    const parentOrgExists = await prisma.dashapp_parentorg.findUnique({
        where: { id: BigInt(parentOrgId) },
        select: { id: true },
    });

    if (!parentOrgExists?.id) {
        throw new NotFoundError("This parent organization does not exists");
    }

    await prisma.dashapp_parentorg.delete({
        where: { id: BigInt(parentOrgId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.PARENT_ORG, true);

    res.status(STATUS_CODE.OK).json({
        message: "Parent organization deleted",
    });
});
