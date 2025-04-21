import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { ActivationResponseDTO } from "../dto/activation.dto.js";
import { STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { TCreateActivationSchema, TEditActivationSchema } from "../schemas/activation.schema.js";
import { activationSelect } from "../types/activation.type.js";

export const getAllActivations = asyncHandler(async (req, res) => {
  const { take, skip } = req.query;

  const activations = await prisma.dashapp_activation.findMany({
    select: {
      id: true,
      name: true,
      created_date: true,
      modified_date: true,
      dashapp_athlete: {
        select: { id: true, athlete_name: true },
      },
      dashapp_leagueinfo: {
        select: { id: true, property_name: true },
      },
      dashapp_team: {
        select: { id: true, team_name: true },
      },
      dashapp_companydata: {
        select: { id: true, company_name: true },
      },
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
      id: activation.id,
      name: activation.name,
      brand: activation.dashapp_companydata?.company_name,
      partner:
        activation.dashapp_athlete?.athlete_name ||
        activation.dashapp_team?.team_name ||
        activation.dashapp_leagueinfo?.property_name,
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

  if (!activation?.id) {
    throw new NotFoundError("This activation summary does not exists");
  }

  const activationResponseDTO: ActivationResponseDTO = ActivationResponseDTO.toResponse(activation);

  res.status(STATUS_CODE.OK).json(activationResponseDTO);
});

export const createActivation = asyncHandler(async (req, res) => {
  const { name, userId, assetIds, marketIds, typeIds, year, brandId, athleteId, leagueId, teamId } =
    req.validatedData as TCreateActivationSchema;

  await prisma.dashapp_activation.create({
    data: {
      name: name,
      created_by: { connect: { id: BigInt(userId) } },
      modified_by: { connect: { id: BigInt(userId) } },
      dashapp_activation_assets: assetIds
        ? {
            create: assetIds?.map((assetId) => ({
              dashapp_assets: {
                connect: { id: BigInt(assetId) },
              },
            })),
          }
        : undefined,
      dashapp_activation_market: marketIds
        ? {
            create: marketIds.map((marketId) => ({
              dashapp_states: { connect: { id: BigInt(marketId) } },
            })),
          }
        : undefined,
      dashapp_activation_type: typeIds
        ? {
            create: typeIds.map((typeId) => ({
              dashapp_marketingplatform: {
                connect: { id: BigInt(typeId) },
              },
            })),
          }
        : undefined,
      dashapp_companydata: brandId ? { connect: { id: BigInt(brandId) } } : undefined,
      dashapp_leagueinfo: leagueId ? { connect: { id: BigInt(leagueId) } } : undefined,
      dashapp_team: teamId ? { connect: { id: BigInt(teamId) } } : undefined,
      dashapp_athlete: athleteId ? { connect: { id: BigInt(athleteId) } } : undefined,
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

  if (!activationExits?.id) {
    throw new NotFoundError("This activation summary does not exists");
  }

  const { name, assetIds, athleteId, brandId, leagueId, marketIds, teamId, typeIds, year } =
    req.validatedData as TEditActivationSchema;

  if ((leagueId && teamId) || (leagueId && athleteId) || (athleteId && teamId)) {
    throw new BadRequestError("Activation summary cannot have multiple stakeholders");
  }

  const userId = req.user.userId;

  await prisma.dashapp_activation.update({
    where: { id: BigInt(activationId) },
    data: {
      name: name || null,
      modified_by: userId ? { connect: { id: BigInt(userId) } } : undefined,
      dashapp_activation_assets: {
        deleteMany: {},
        ...(assetIds?.length && {
          create: assetIds?.map((assetId) => ({
            dashapp_assets: {
              connect: { id: BigInt(assetId) },
            },
          })),
        }),
      },
      dashapp_activation_market: {
        deleteMany: {},
        ...(marketIds?.length && {
          create: marketIds.map((marketId) => ({
            dashapp_states: { connect: { id: BigInt(marketId) } },
          })),
        }),
      },
      dashapp_activation_type: {
        deleteMany: {},
        ...(typeIds?.length && {
          create: typeIds.map((typeId) => ({
            dashapp_marketingplatform: {
              connect: { id: BigInt(typeId) },
            },
          })),
        }),
      },
      dashapp_companydata: brandId ? { connect: { id: BigInt(brandId) } } : { disconnect: true },
      dashapp_leagueinfo: leagueId ? { connect: { id: BigInt(leagueId) } } : { disconnect: true },
      dashapp_team: teamId ? { connect: { id: BigInt(teamId) } } : { disconnect: true },
      dashapp_athlete: athleteId ? { connect: { id: BigInt(athleteId) } } : { disconnect: true },
      Year: year || null,
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

  if (!activationExists?.id) {
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
