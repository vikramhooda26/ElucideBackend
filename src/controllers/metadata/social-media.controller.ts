import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { TCreateSocialMediaSchema, TEditSocialMediaSchema } from "../../schemas/metadata/social-media.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllSocialMedias = asyncHandler(async (req, res) => {
  const { take, skip } = req.query;

  const socialMedia = await prisma.dashapp_socialmedia_platform.findMany({
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

  if (socialMedia.length < 1) {
    throw new NotFoundError("Social media data does not exists");
  }

  res.status(STATUS_CODE.OK).json(
    socialMedia.map((socialMedia) => ({
      id: socialMedia.id,
      socialMediaName: socialMedia.name,
      createdDate: socialMedia.created_date,
      modifiedDate: socialMedia.modified_date,
      createdBy: {
        userId: socialMedia.created_by?.id,
        email: socialMedia.created_by?.email,
      },
      modifiedBy: {
        userId: socialMedia.modified_by?.id,
        email: socialMedia.modified_by?.email,
      },
      count: socialMedia._count,
    })),
  );
});

export const getSocialMediaById = asyncHandler(async (req, res) => {
  const socialMediaId = req.params.id;

  if (!socialMediaId) {
    throw new BadRequestError("Social media ID not found");
  }

  const socialMedia = await prisma.dashapp_socialmedia_platform.findUnique({
    where: { id: BigInt(socialMediaId) },
    select: {
      id: true,
      name: true,
    },
  });

  if (!socialMedia?.id) {
    throw new NotFoundError("This social media does not exists");
  }

  res.status(STATUS_CODE.OK).json({
    id: socialMedia.id,
    socialMediaName: socialMedia.name,
  });
});

export const createSocialMedia = asyncHandler(async (req, res) => {
  const { socialMedia, userId } = req.validatedData as TCreateSocialMediaSchema;

  await prisma.dashapp_socialmedia_platform.create({
    data: {
      name: socialMedia,
      created_by: { connect: { id: BigInt(userId) } },
      modified_by: { connect: { id: BigInt(userId) } },
    },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.SOCIAL_MEDIA, true);

  res.status(STATUS_CODE.OK).json({
    message: "Social media created",
  });
});

export const editSocialMedia = asyncHandler(async (req, res) => {
  const socialMediaId = req.params.id;

  if (!socialMediaId) {
    throw new BadRequestError("Social media ID not found");
  }

  const socialMediaExits = await prisma.dashapp_socialmedia_platform.findUnique({
    where: { id: BigInt(socialMediaId) },
    select: { id: true },
  });

  if (!socialMediaExits?.id) {
    throw new NotFoundError("This social media does not exists");
  }

  const { socialMedia, userId } = req.validatedData as TEditSocialMediaSchema;

  await prisma.dashapp_socialmedia_platform.update({
    where: { id: BigInt(socialMediaId) },
    data: {
      name: socialMedia,
      modified_by: { connect: { id: BigInt(userId) } },
    },
    select: {
      id: true,
    },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.SOCIAL_MEDIA, true);

  res.status(STATUS_CODE.OK).json({
    message: "Social media updated",
  });
});

export const deleteSocialMedia = asyncHandler(async (req, res) => {
  const socialMediaId = req.params.id;

  if (!socialMediaId) {
    throw new BadRequestError("social media ID not found");
  }

  const socialMediaExists = await prisma.dashapp_socialmedia_platform.findUnique({
    where: { id: BigInt(socialMediaId) },
    select: { id: true },
  });

  if (!socialMediaExists?.id) {
    throw new NotFoundError("This social media does not exists");
  }

  await prisma.dashapp_socialmedia_platform.delete({
    where: { id: BigInt(socialMediaId) },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.SOCIAL_MEDIA, true);

  res.status(STATUS_CODE.OK).json({
    message: "Social media deleted",
  });
});
