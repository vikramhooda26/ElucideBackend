import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateAgencySchema,
    TEditAgencySchema,
} from "../../schemas/metadata/agency.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllAgencies = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const agencies = await prisma.dashapp_agency.findMany({
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

    if (agencies.length < 1) {
        throw new NotFoundError("Agency data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        agencies.map((agency) => ({
            agencyId: agency.id,
            agencyName: agency.name,
            createdDate: agency.created_date,
            modifiedDate: agency.modified_date,
            createdBy: {
                userId: agency.created_by?.id,
                email: agency.created_by?.email,
            },
            modifiedBy: {
                userId: agency.modified_by?.id,
                email: agency.modified_by?.email,
            },
            count: agency._count,
        })),
    );
});

export const getAgencyById = asyncHandler(async (req, res) => {
    const agencyId = req.params.id;

    if (!agencyId) {
        throw new BadRequestError("Agency ID not found");
    }

    const agency = await prisma.dashapp_agency.findUnique({
        where: { id: BigInt(agencyId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!agency?.id) {
        throw new NotFoundError("This agency does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        agencyId: agency.id,
        agencyName: agency.name,
    });
});

export const createAgency = asyncHandler(async (req, res) => {
    const { agencyName, userId } = req.validatedData as TCreateAgencySchema;

    await prisma.dashapp_agency.create({
        data: {
            name: agencyName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.AGENCY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Agency created",
    });
});

export const editAgency = asyncHandler(async (req, res) => {
    const agencyId = req.params.id;

    if (!agencyId) {
        throw new BadRequestError("Agency ID not found");
    }

    const agencyExists = await prisma.dashapp_agency.findUnique({
        where: { id: BigInt(agencyId) },
        select: { id: true },
    });

    if (!agencyExists?.id) {
        throw new NotFoundError("This agency does not exists");
    }

    const { agencyName, userId } = req.validatedData as TEditAgencySchema;

    await prisma.dashapp_agency.update({
        where: { id: BigInt(agencyId) },
        data: {
            name: agencyName,
            modified_by: {
                connect: { id: BigInt(userId) },
            },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.AGENCY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Agency details updated",
    });
});

export const deleteAgency = asyncHandler(async (req, res) => {
    const agencyId = req.params.id;

    if (!agencyId) {
        throw new BadRequestError("Agency ID not found");
    }

    const agencyExists = await prisma.dashapp_agency.findUnique({
        where: { id: BigInt(agencyId) },
        select: { id: true },
    });

    if (!agencyExists?.id) {
        throw new NotFoundError("This agency does not exists");
    }

    await prisma.dashapp_agency.delete({
        where: { id: BigInt(agencyId) },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.AGENCY, true);

    res.status(STATUS_CODE.OK).json({
        message: "Agency deleted",
    });
});
