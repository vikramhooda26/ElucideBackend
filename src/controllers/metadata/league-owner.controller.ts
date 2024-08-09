import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import {
    TCreateLeagueOwnerSchema,
    TEditLeagueOwnerSchema,
} from "../../schemas/metadata/league-owner.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllLeagueOwners = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const leagueOwners = await prisma.dashapp_leagueowner.findMany({
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

    if (leagueOwners.length < 1) {
        throw new NotFoundError("League owners data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        leagueOwners.map((leagueOwner) => ({
            id: leagueOwner.id,
            leagueOwnerName: leagueOwner.name,
            createdDate: leagueOwner.created_date,
            modifiedDate: leagueOwner.modified_date,
            createdBy: {
                userId: leagueOwner.created_by?.id,
                email: leagueOwner.created_by?.email,
            },
            modifiedBy: {
                userId: leagueOwner.modified_by?.id,
                email: leagueOwner.modified_by?.email,
            },
            count: leagueOwner._count,
        })),
    );
});

export const getLeagueOwnerById = asyncHandler(async (req, res) => {
    const leagueOwnerId = req.params.id;

    if (!leagueOwnerId) {
        throw new BadRequestError("League owner ID not found");
    }

    const leagueOwner = await prisma.dashapp_leagueowner.findUnique({
        where: { id: BigInt(leagueOwnerId) },
        select: {
            id: true,
            name: true,
        },
    });

    if (!leagueOwner?.id) {
        throw new NotFoundError("This league owner does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        id: leagueOwner.id,
        leagueOwnerName: leagueOwner.name,
    });
});

export const createLeagueOwner = asyncHandler(async (req, res) => {
    const { leagueOwnerName, userId } =
        req.validatedData as TCreateLeagueOwnerSchema;

    await prisma.dashapp_leagueowner.create({
        data: {
            name: leagueOwnerName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.LEAGUE_OWNER, true);

    res.status(STATUS_CODE.OK).json({
        message: "League owner created",
    });
});

export const editLeagueOwner = asyncHandler(async (req, res) => {
    const leagueOwnerId = req.params.id;

    if (!leagueOwnerId) {
        throw new BadRequestError("League owner ID not found");
    }

    const leagueOwnerExists = await prisma.dashapp_leagueowner.findUnique({
        where: { id: BigInt(leagueOwnerId) },
        select: { id: true },
    });

    if (!leagueOwnerExists?.id) {
        throw new NotFoundError("This league owner does not exists");
    }

    const { leagueOwnerName, userId } =
        req.validatedData as TEditLeagueOwnerSchema;

    await prisma.dashapp_leagueowner.update({
        where: { id: BigInt(leagueOwnerId) },
        data: {
            name: leagueOwnerName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.LEAGUE_OWNER, true);

    res.status(STATUS_CODE.OK).json({
        message: "League owner updated",
    });
});

export const deleteLeagueOwner = asyncHandler(async (req, res) => {
    const leagueOwnerId = req.params.id;

    if (!leagueOwnerId) {
        throw new BadRequestError("League owner ID not found");
    }

    const leagueOwnerExists = await prisma.dashapp_leagueowner.findUnique({
        where: { id: BigInt(leagueOwnerId) },
        select: { id: true },
    });

    if (!leagueOwnerExists?.id) {
        throw new NotFoundError("This league owner does not exists");
    }

    await prisma.dashapp_leagueowner.delete({
        where: { id: BigInt(leagueOwnerId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.LEAGUE_OWNER, true);

    res.status(STATUS_CODE.OK).json({
        message: "League owner deleted",
    });
});
