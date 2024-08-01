import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateTeamOwnerSchema,
    TEditTeamOwnerSchema,
} from "../../schemas/metadata/team-owner.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllTeamOwners = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const teamOwners = await prisma.dashapp_teamowner.findMany({
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

    if (teamOwners.length < 1) {
        throw new NotFoundError("Team owners data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        teamOwners.map((teamOwner) => ({
            teamOwnerId: teamOwner.id,
            teamOwnerName: teamOwner.name,
            createdDate: teamOwner.created_date,
            modifiedDate: teamOwner.modified_date,
            createdBy: {
                userId: teamOwner.created_by?.id,
                email: teamOwner.created_by?.email,
            },
            modifiedBy: {
                userId: teamOwner.modified_by?.id,
                email: teamOwner.modified_by?.email,
            },
            count: teamOwner._count,
        })),
    );
});

export const getTeamOwnerById = asyncHandler(async (req, res) => {
    const teamOwnerId = req.params.id;

    if (!teamOwnerId) {
        throw new BadRequestError("Team owner ID not found");
    }

    const teamOwner = await prisma.dashapp_teamowner.findUnique({
        where: { id: BigInt(teamOwnerId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!teamOwner) {
        throw new NotFoundError("This team owner does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        teamOwnerId: teamOwner.id,
        teamOwnerName: teamOwner.name,
    });
});

export const createTeamOwner = asyncHandler(async (req, res) => {
    const { teamOwnerName, userId } =
        req.validatedData as TCreateTeamOwnerSchema;

    await prisma.dashapp_teamowner.create({
        data: {
            name: teamOwnerName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TEAM_OWNER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Team owner created",
    });
});

export const editTeamOwner = asyncHandler(async (req, res) => {
    const teamOwnerId = req.params.id;

    if (!teamOwnerId) {
        throw new BadRequestError("Team owner ID not found");
    }

    const teamOwnerExits = await prisma.dashapp_teamowner.findUnique({
        where: { id: BigInt(teamOwnerId) },
        select: { id: true },
    });

    if (!teamOwnerExits) {
        throw new NotFoundError("This team owner does not exists");
    }

    const { teamOwnerName, userId } = req.validatedData as TEditTeamOwnerSchema;

    await prisma.dashapp_teamowner.update({
        where: { id: BigInt(teamOwnerId) },
        data: {
            name: teamOwnerName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TEAM_OWNER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Team owner updated",
    });
});

export const deleteTeamOwner = asyncHandler(async (req, res) => {
    const teamOwnerId = req.params.id;

    if (!teamOwnerId) {
        throw new BadRequestError("Team owner ID not found");
    }

    const teamOwnerExists = await prisma.dashapp_teamowner.findUnique({
        where: { id: BigInt(teamOwnerId) },
        select: { id: true },
    });

    if (!teamOwnerExists) {
        throw new NotFoundError("This team owner does not exists");
    }

    await prisma.dashapp_teamowner.delete({
        where: { id: BigInt(teamOwnerId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TEAM_OWNER, true);

    res.status(STATUS_CODE.OK).json({
        message: "Team owner deleted",
    });
});
