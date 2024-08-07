import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { SportsDealSummaryResponseDTO } from "../dto/sports-deal-summary.dto.js";
import { STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import {
    TCreateSportsDealSummarySchema,
    TEditSportsDealSummarySchema,
} from "../schemas/sports-deal-summary.schema.js";
import { sportsDealSummarySelect } from "../types/sports-deal-summary.type.js";
import { Decimal } from "@prisma/client/runtime/library";

export const getAllSportsDealSummaries = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const sportsDealSummaries = await prisma.dashapp_sportsdealsummary.findMany(
        {
            select: {
                id: true,
                dashapp_companydata: { select: { company_name: true } },
                dashapp_athlete: { select: { athlete_name: true } },
                dashapp_team: { select: { team_name: true } },
                dashapp_leagueinfo: { select: { property_name: true } },
                type: true,
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
        },
    );

    if (sportsDealSummaries.length < 1) {
        throw new NotFoundError("Sports deal summaries data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        sportsDealSummaries.map((sportsDealSummary) => ({
            sportsDealSummaryId: sportsDealSummary.id,
            type: sportsDealSummary.type,
            brandName: sportsDealSummary.dashapp_companydata?.company_name,
            teamName: sportsDealSummary.dashapp_team?.team_name,
            leagueName: sportsDealSummary.dashapp_leagueinfo?.property_name,
            athleteName: sportsDealSummary.dashapp_athlete?.athlete_name,
            createdDate: sportsDealSummary.created_date,
            modifiedDate: sportsDealSummary.modified_date,
            createdBy: {
                userId: sportsDealSummary.created_by?.id,
                email: sportsDealSummary.created_by?.email,
            },
            modifiedBy: {
                userId: sportsDealSummary.modified_by?.id,
                email: sportsDealSummary.modified_by?.email,
            },
            count: sportsDealSummary._count,
        })),
    );
});

export const getSportsDealSummaryById = asyncHandler(async (req, res) => {
    const sportsDealSummaryId = req.params.id;

    if (!sportsDealSummaryId) {
        throw new BadRequestError("Sport deal summary ID not found");
    }

    const sportsDealSummary = await prisma.dashapp_sportsdealsummary.findUnique(
        {
            where: { id: BigInt(sportsDealSummaryId) },
            select: sportsDealSummarySelect,
        },
    );

    if (!sportsDealSummary?.id) {
        throw new NotFoundError("This sports deal summary does not exists");
    }

    const sportsDealSummaryResponseDTO: SportsDealSummaryResponseDTO =
        SportsDealSummaryResponseDTO.toResponse(sportsDealSummary);

    res.status(STATUS_CODE.OK).json(sportsDealSummaryResponseDTO);
});

export const createSportsDealSummary = asyncHandler(async (req, res) => {
    const {
        annualValue,
        assetIds,
        commencementYear,
        duration,
        expirationDate,
        levelId,
        mediaLink,
        status,
        territoryId,
        totalValue,
        type,
        brandId,
        athleteId,
        leagueId,
        teamId,
        userId,
    } = req.validatedData as TCreateSportsDealSummarySchema;

    await prisma.dashapp_sportsdealsummary.create({
        data: {
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
            dashapp_sportsdeal_assets: {
                create: assetIds
                    ? assetIds?.map((assetId) => ({
                          dashapp_assets: {
                              connect: { id: BigInt(assetId) },
                          },
                      }))
                    : undefined,
            },
            dashapp_territory: territoryId
                ? {
                      connect: { id: BigInt(territoryId) },
                  }
                : undefined,
            dashapp_level: levelId
                ? {
                      connect: { id: BigInt(levelId) },
                  }
                : undefined,
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
            annual_value: annualValue ? new Decimal(annualValue) : undefined,
            total_value: totalValue ? new Decimal(totalValue) : undefined,
            commencement_date: commencementYear ?? undefined,
            expiration_date: expirationDate ?? undefined,
            type: type ?? undefined,
            status: status ?? undefined,
            duration: duration ?? undefined,
            media_link: mediaLink ?? undefined,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Sports deal summary created",
    });
});

export const editSportsDealSummary = asyncHandler(async (req, res) => {
    const sportsDealSummaryId = req.params.id;

    if (!sportsDealSummaryId) {
        throw new BadRequestError("Sports deal summary ID not found");
    }

    const sportsDealSummaryExits =
        await prisma.dashapp_sportsdealsummary.findUnique({
            where: { id: BigInt(sportsDealSummaryId) },
            select: { id: true },
        });

    if (!sportsDealSummaryExits?.id) {
        throw new NotFoundError("This sports deal summary does not exists");
    }

    const {
        annualValue,
        assetIds,
        athleteId,
        brandId,
        commencementYear,
        duration,
        expirationDate,
        leagueId,
        levelId,
        mediaLink,
        status,
        teamId,
        territoryId,
        totalValue,
        type,
        userId,
    } = req.validatedData as TEditSportsDealSummarySchema;

    await prisma.dashapp_sportsdealsummary.update({
        where: { id: BigInt(sportsDealSummaryId) },
        data: {
            modified_by: userId
                ? { connect: { id: BigInt(userId) } }
                : undefined,
            dashapp_sportsdeal_assets: {
                create: assetIds
                    ? assetIds?.map((assetId) => ({
                          dashapp_assets: {
                              connect: { id: BigInt(assetId) },
                          },
                      }))
                    : undefined,
            },
            dashapp_territory: territoryId
                ? {
                      connect: { id: BigInt(territoryId) },
                  }
                : undefined,
            dashapp_level: levelId
                ? {
                      connect: { id: BigInt(levelId) },
                  }
                : undefined,
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
            annual_value: annualValue ? new Decimal(annualValue) : undefined,
            total_value: totalValue ? new Decimal(totalValue) : undefined,
            commencement_date: commencementYear ?? undefined,
            expiration_date: expirationDate ?? undefined,
            type: type ?? undefined,
            status: status ?? undefined,
            duration: duration ?? undefined,
            media_link: mediaLink ?? undefined,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Sports deal summary updated",
    });
});

export const deleteSportsDealSummary = asyncHandler(async (req, res) => {
    const sportsDealSummaryId = req.params.id;

    if (!sportsDealSummaryId) {
        throw new BadRequestError("Sports deal summary ID not found");
    }

    const sportsDealSummaryExists =
        await prisma.dashapp_sportsdealsummary.findUnique({
            where: { id: BigInt(sportsDealSummaryId) },
            select: { id: true },
        });

    if (!sportsDealSummaryExists?.id) {
        throw new NotFoundError("This sports deal summary does not exists");
    }

    await prisma.dashapp_sportsdealsummary.delete({
        where: { id: BigInt(sportsDealSummaryId) },
        select: { id: true },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Sports deal summary deleted",
    });
});
