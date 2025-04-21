import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { TCreateAthleteStatusSchema, TEditAthleteStatusSchema } from "../../schemas/metadata/athlete-status.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllAthleteStatus = asyncHandler(async (req, res) => {
  const { take, skip } = req.query;

  const athleteStatus = await prisma.dashapp_athlete_status.findMany({
    select: {
      id: true,
      status: true,
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

  if (athleteStatus.length < 1) {
    throw new NotFoundError("Athlete status data does not exists");
  }

  res.status(STATUS_CODE.OK).json(
    athleteStatus.map((status) => ({
      id: status.id,
      athleteStatusName: status.status,
      createdDate: status.created_date,
      modifiedDate: status.modified_date,
      createdBy: {
        userId: status.created_by?.id,
        email: status.created_by?.email,
      },
      modifiedBy: {
        userId: status.modified_by?.id,
        email: status.modified_by?.email,
      },
      count: status._count,
    })),
  );
});

export const getAthleteStatusById = asyncHandler(async (req, res) => {
  const statusId = req.params.id;

  if (!statusId) {
    throw new BadRequestError("Status ID not found");
  }

  const status = await prisma.dashapp_athlete_status.findUnique({
    where: { id: BigInt(statusId) },
    select: {
      id: true,
      status: true,
    },
  });

  if (!status?.id) {
    throw new NotFoundError("This status does not exists");
  }

  res.status(STATUS_CODE.OK).json({
    id: status.id,
    athleteStatusName: status.status,
  });
});

export const createAthleteStatus = asyncHandler(async (req, res) => {
  const { status, userId } = req.validatedData as TCreateAthleteStatusSchema;

  await prisma.dashapp_athlete_status.create({
    data: {
      status,
      created_by: { connect: { id: BigInt(userId) } },
      modified_by: { connect: { id: BigInt(userId) } },
    },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.ATHLETE_STATUS, true);

  res.status(STATUS_CODE.OK).json({
    message: "Status created",
  });
});

export const editAthleteStatus = asyncHandler(async (req, res) => {
  const statusId = req.params.id;

  if (!statusId) {
    throw new BadRequestError("Status ID not found");
  }

  const statusExits = await prisma.dashapp_athlete_status.findUnique({
    where: { id: BigInt(statusId) },
    select: { id: true },
  });

  if (!statusExits?.id) {
    throw new NotFoundError("This status does not exists");
  }

  const { status, userId } = req.validatedData as TEditAthleteStatusSchema;

  await prisma.dashapp_athlete_status.update({
    where: { id: BigInt(statusId) },
    data: {
      status,
      modified_by: { connect: { id: BigInt(userId) } },
    },
    select: {
      id: true,
    },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.ATHLETE_STATUS, true);

  res.status(STATUS_CODE.OK).json({
    message: "Status updated",
  });
});

export const deleteAthleteStatus = asyncHandler(async (req, res) => {
  const statusId = req.params.id;

  if (!statusId) {
    throw new BadRequestError("Status ID not found");
  }

  const statusExists = await prisma.dashapp_athlete_status.findUnique({
    where: { id: BigInt(statusId) },
    select: { id: true },
  });

  if (!statusExists?.id) {
    throw new NotFoundError("This status does not exists");
  }

  await prisma.dashapp_athlete_status.delete({
    where: { id: BigInt(statusId) },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.ATHLETE_STATUS, true);

  res.status(STATUS_CODE.OK).json({
    message: "Status deleted",
  });
});
