import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { TCreateOttPartnerSchema, TEditOttPartnerSchema } from "../../schemas/metadata/ott-partner.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllOttPartners = asyncHandler(async (req, res) => {
  const { take, skip } = req.query;

  const ottpartners = await prisma.dashapp_ottpartner.findMany({
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

  if (ottpartners.length < 1) {
    throw new NotFoundError("Ott partners data does not exists");
  }

  res.status(STATUS_CODE.OK).json(
    ottpartners.map((ottpartner) => ({
      id: ottpartner.id,
      ottpartnerName: ottpartner.name,
      createdDate: ottpartner.created_date,
      modifiedDate: ottpartner.modified_date,
      createdBy: {
        userId: ottpartner.created_by?.id,
        email: ottpartner.created_by?.email,
      },
      modifiedBy: {
        userId: ottpartner.modified_by?.id,
        email: ottpartner.modified_by?.email,
      },
      count: ottpartner._count,
    })),
  );
});

export const getOttPartnerById = asyncHandler(async (req, res) => {
  const ottpartnerId = req.params.id;

  if (!ottpartnerId) {
    throw new BadRequestError("Ott partner ID not found");
  }

  const ottpartner = await prisma.dashapp_ottpartner.findUnique({
    where: { id: BigInt(ottpartnerId) },
    select: {
      id: true,
      name: true,
    },
  });

  if (!ottpartner?.id) {
    throw new NotFoundError("This ott partner does not exists");
  }

  res.status(STATUS_CODE.OK).json({
    id: ottpartner.id,
    ottPartnerName: ottpartner.name,
  });
});

export const createOttPartner = asyncHandler(async (req, res) => {
  const { ottPartnerName, userId } = req.validatedData as TCreateOttPartnerSchema;

  await prisma.dashapp_ottpartner.create({
    data: {
      name: ottPartnerName,
      created_by: { connect: { id: BigInt(userId) } },
      modified_by: { connect: { id: BigInt(userId) } },
    },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.OTT_PARTNER, true);

  res.status(STATUS_CODE.OK).json({
    message: "Ott partner created",
  });
});

export const editOttPartner = asyncHandler(async (req, res) => {
  const ottpartnerId = req.params.id;

  if (!ottpartnerId) {
    throw new BadRequestError("Ott partner ID not found");
  }

  const ottpartnerExits = await prisma.dashapp_ottpartner.findUnique({
    where: { id: BigInt(ottpartnerId) },
    select: { id: true },
  });

  if (!ottpartnerExits?.id) {
    throw new NotFoundError("This ott partner does not exists");
  }

  const { ottPartnerName, userId } = req.validatedData as TEditOttPartnerSchema;

  await prisma.dashapp_ottpartner.update({
    where: { id: BigInt(ottpartnerId) },
    data: {
      name: ottPartnerName,
      modified_by: { connect: { id: BigInt(userId) } },
    },
    select: {
      id: true,
    },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.OTT_PARTNER, true);

  res.status(STATUS_CODE.OK).json({
    message: "Ott partner updated",
  });
});

export const deleteOttPartner = asyncHandler(async (req, res) => {
  const ottpartnerId = req.params.id;

  if (!ottpartnerId) {
    throw new BadRequestError("Ott partner ID not found");
  }

  const ottpartnerExists = await prisma.dashapp_ottpartner.findUnique({
    where: { id: BigInt(ottpartnerId) },
    select: { id: true },
  });

  if (!ottpartnerExists?.id) {
    throw new NotFoundError("This ott partner does not exists");
  }

  await prisma.dashapp_ottpartner.delete({
    where: { id: BigInt(ottpartnerId) },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.OTT_PARTNER, true);

  res.status(STATUS_CODE.OK).json({
    message: "Ott partner deleted",
  });
});
