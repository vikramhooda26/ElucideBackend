import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { activationSelect } from "../types/activation.type.js";
import { ActivationResponseDTO } from "../dto/activation.dto.js";
import {
    TCreateActivationSchema,
    TEditActivationSchema,
} from "../schemas/activation.schema.js";

export const getAllActivations = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const activations = await prisma.dashapp_activation.findMany({
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

    if (activations.length < 1) {
        throw new NotFoundError("Activation summaries data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        activations.map((activation) => ({
            activationId: activation.id,
            activationName: activation.name,
            createdDate: activation.created_date,
            modifiedDate: activation.modified_date,
            createdBy: {
                userId: activation.created_by?.id,
                email: activation.created_by?.email,
            },
            modifiedBy: {
                userId: activation.modified_by?.id,
                email: activation.modified_by?.email,
            },
            count: activation._count,
        })),
    );
});

export const getActivationById = asyncHandler(async (req, res) => {
    const activationId = req.params.id;

    if (!activationId) {
        throw new BadRequestError("Activation summary ID not found");
    }

    const activation = await prisma.dashapp_activation.findUnique({
        where: { id: BigInt(activationId) },
        select: activationSelect,
    });

    if (!activation) {
        throw new NotFoundError("This activation summary does not exists");
    }

    const activationResponseDTO: ActivationResponseDTO =
        ActivationResponseDTO.toResponse(activation);

    res.status(STATUS_CODE.OK).json(activationResponseDTO);
});

export const createActivation = asyncHandler(async (req, res) => {
    const {
        activationName,
        userId,
        assetIds,
        marketIds,
        typeIds,
        year,
        brandId,
        athleteId,
        leagueId,
        teamId,
    } = req.validatedData as TCreateActivationSchema;

    await prisma.dashapp_activation.create({
        data: {
            name: activationName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
            dashapp_activation_assets: {
                create: assetIds?.map((assetId) => ({
                    dashapp_assets: {
                        connect: { id: BigInt(assetId) },
                    },
                })),
            },
            dashapp_activation_market: {
                create: marketIds
                    ? marketIds.map((marketId) => ({
                          dashapp_states: { connect: { id: BigInt(marketId) } },
                      }))
                    : undefined,
            },
            dashapp_activation_type: {
                create: typeIds
                    ? typeIds.map((typeId) => ({
                          dashapp_marketingplatform: {
                              connect: { id: BigInt(typeId) },
                          },
                      }))
                    : undefined,
            },
            dashapp_companydata: brandId
                ? { connect: { id: BigInt(brandId) } }
                : undefined,
            dashapp_leagueinfo: leagueId
                ? { connect: { id: BigInt(leagueId) } }
                : undefined,
            dashapp_team: teamId
                ? { connect: { id: BigInt(teamId) } }
                : undefined,
            dashapp_athlete: athleteId
                ? { connect: { id: BigInt(athleteId) } }
                : undefined,
            Year: year,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Activation summary created",
    });
});

export const editActivation = asyncHandler(async (req, res) => {
    const activationId = req.params.id;

    if (!activationId) {
        throw new BadRequestError("Activation summary ID not found");
    }

    const activationExits = await prisma.dashapp_activation.findUnique({
        where: { id: BigInt(activationId) },
        select: { id: true },
    });

    if (!activationExits) {
        throw new NotFoundError("This activation summary does not exists");
    }

    const {
        activationName,
        assetIds,
        athleteId,
        brandId,
        leagueId,
        marketIds,
        teamId,
        typeIds,
        userId,
        year,
    } = req.validatedData as TEditActivationSchema;

    await prisma.dashapp_activation.update({
        where: { id: BigInt(activationId) },
        data: {
            name: activationName ?? undefined,
            created_by: userId
                ? { connect: { id: BigInt(userId) } }
                : undefined,
            modified_by: userId
                ? { connect: { id: BigInt(userId) } }
                : undefined,
            dashapp_activation_assets: {
                create: assetIds
                    ? assetIds?.map((assetId) => ({
                          dashapp_assets: {
                              connect: { id: BigInt(assetId) },
                          },
                      }))
                    : undefined,
            },
            dashapp_activation_market: {
                create: marketIds
                    ? marketIds.map((marketId) => ({
                          dashapp_states: { connect: { id: BigInt(marketId) } },
                      }))
                    : undefined,
            },
            dashapp_activation_type: {
                create: typeIds
                    ? typeIds.map((typeId) => ({
                          dashapp_marketingplatform: {
                              connect: { id: BigInt(typeId) },
                          },
                      }))
                    : undefined,
            },
            dashapp_companydata: brandId
                ? { connect: { id: BigInt(brandId) } }
                : undefined,
            dashapp_leagueinfo: leagueId
                ? { connect: { id: BigInt(leagueId) } }
                : undefined,
            dashapp_team: teamId
                ? { connect: { id: BigInt(teamId) } }
                : undefined,
            dashapp_athlete: athleteId
                ? { connect: { id: BigInt(athleteId) } }
                : undefined,
            Year: year ?? undefined,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Activation summary updated",
    });
});

export const deleteActivation = asyncHandler(async (req, res) => {
    const activationId = req.params.id;

    if (!activationId) {
        throw new BadRequestError("Activation ID not found");
    }

    const activationExists = await prisma.dashapp_activation.findUnique({
        where: { id: BigInt(activationId) },
        select: { id: true },
    });

    if (!activationExists) {
        throw new NotFoundError("This activation does not exists");
    }

    await prisma.dashapp_activation.delete({
        where: { id: BigInt(activationId) },
        select: { id: true },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Activation deleted",
    });
});
