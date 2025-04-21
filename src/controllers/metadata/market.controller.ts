import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { prisma } from "../../db/index.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { TCreateKeyMarketSchema, TEditKeyMarketSchema } from "../../schemas/metadata/market.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllkeyMarket = asyncHandler(async (req, res) => {
  const { take, skip } = req.query;

  const keyMarkets = await prisma.dashapp_keymarket.findMany({
    select: {
      id: true,
      zone: true,
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

  if (keyMarkets.length < 1) {
    throw new NotFoundError("Key Markets data does not exists");
  }

  res.status(STATUS_CODE.OK).json(
    keyMarkets.map((keyMarket) => ({
      id: keyMarket.id,
      keyMarketName: keyMarket.zone,
      createdDate: keyMarket.created_date,
      modifiedDate: keyMarket.modified_date,
      createdBy: {
        userId: keyMarket.created_by?.id,
        email: keyMarket.created_by?.email,
      },
      modifiedBy: {
        userId: keyMarket.modified_by?.id,
        email: keyMarket.modified_by?.email,
      },
      count: keyMarket._count,
    })),
  );
});

export const getKeyMarketById = asyncHandler(async (req, res) => {
  const keyMarketId = req.params.id;

  if (!keyMarketId) {
    throw new BadRequestError("Key market ID not found");
  }

  const keyMarket = await prisma.dashapp_keymarket.findUnique({
    where: { id: BigInt(keyMarketId) },
    select: {
      id: true,
      zone: true,
    },
  });

  if (!keyMarket?.id) {
    throw new NotFoundError("This key market does not exists");
  }

  res.status(STATUS_CODE.OK).json({
    id: keyMarket.id,
    keyMarketName: keyMarket.zone,
  });
});

export const createKeyMarket = asyncHandler(async (req, res) => {
  const { keyMarketName, userId } = req.validatedData as TCreateKeyMarketSchema;

  await prisma.dashapp_keymarket.create({
    data: {
      zone: keyMarketName,
      created_by: { connect: { id: BigInt(userId) } },
      modified_by: { connect: { id: BigInt(userId) } },
    },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.KEY_MARKETS, true);

  res.status(STATUS_CODE.OK).json({
    message: "Key market created",
  });
});

export const editKeyMarket = asyncHandler(async (req, res) => {
  const keyMarketId = req.params.id;

  if (!keyMarketId) {
    throw new BadRequestError("Key market ID not found");
  }

  const keyMarketExits = await prisma.dashapp_keymarket.findUnique({
    where: { id: BigInt(keyMarketId) },
    select: { id: true },
  });

  if (!keyMarketExits?.id) {
    throw new NotFoundError("This key market does not exists");
  }

  const { keyMarketName, userId } = req.validatedData as TEditKeyMarketSchema;

  await prisma.dashapp_keymarket.update({
    where: { id: BigInt(keyMarketId) },
    data: {
      zone: keyMarketName,
      modified_by: { connect: { id: BigInt(userId) } },
    },
    select: {
      id: true,
    },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.KEY_MARKETS, true);

  res.status(STATUS_CODE.OK).json({
    message: "Key market updated",
  });
});

export const deleteKeyMarket = asyncHandler(async (req, res) => {
  const keyMarketId = req.params.id;

  if (!keyMarketId) {
    throw new BadRequestError("Key market ID not found");
  }

  const keyMarketExists = await prisma.dashapp_keymarket.findUnique({
    where: { id: BigInt(keyMarketId) },
    select: { id: true },
  });

  if (!keyMarketExists?.id) {
    throw new NotFoundError("This key market does not exists");
  }

  await prisma.dashapp_keymarket.delete({
    where: { id: BigInt(keyMarketId) },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.KEY_MARKETS, true);

  res.status(STATUS_CODE.OK).json({
    message: "Key market deleted",
  });
});
