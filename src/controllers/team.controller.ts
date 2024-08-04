import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { STATUS_CODE } from "../lib/constants.js";
import { TCreateTeamSchema, TEditTeamSchema } from "../schemas/team.schema.js";
import { teamSelect } from "../types/team.type.js";
import { TeamResponseDTO } from "../dto/team.dto.js";

export const getAllTeams = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const teams = await prisma.dashapp_team.findMany({
        select: {
            id: true,
            team_name: true,
            created_date: true,
            modified_date: true,
            created_by: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                },
            },
            modified_by: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                },
            },
            _count: true,
        },
        orderBy: { modified_date: "desc" },
        take: Number.isNaN(Number(take)) ? undefined : Number(take),
        skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
    });

    if (teams.length < 1) {
        throw new NotFoundError("Team data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        teams.map((team) => ({
            id: team.id,
            name: team.team_name,
            createdDate: team.created_date,
            modifiedDate: team.modified_date,
            createdBy: {
                userId: team.created_by?.id,
                email: team.created_by?.email,
                firstName: team.created_by?.first_name,
                lastName: team.created_by?.last_name,
                username: team.created_by?.username,
            },
            modifiedBy: {
                userId: team.modified_by?.id,
                email: team.modified_by?.email,
                firstName: team.modified_by?.first_name,
                lastName: team.modified_by?.last_name,
                username: team.modified_by?.username,
            },
            count: team._count,
        })),
    );
});

export const getTeamById = asyncHandler(async (req, res) => {
    const teamId = req.params.id;

    if (!teamId) {
        throw new BadRequestError("Team ID not found");
    }

    const team = await prisma.dashapp_team.findUnique({
        where: { id: BigInt(teamId) },
        select: teamSelect,
    });

    if (!team?.id) {
        throw new NotFoundError("This team does not exists");
    }

    const teamResponse: TeamResponseDTO = TeamResponseDTO.toResponse(team);

    res.status(STATUS_CODE.OK).json(teamResponse);
});

export const createTeam = asyncHandler(async (req, res) => {
    const {
        sportId,
        leagueId,
        yearOfInception,
        franchiseFee,
        subPersonalityTraitIds,
        instagram,
        facebook,
        linkedin,
        twitter,
        youtube,
        website,
        tierIds,
        strategyOverview,
        taglineIds,
        activeCampaignIds,
        primaryMarketingPlatformIds,
        name,
        cityId,
        ownerIds,
        secondaryMarketingPlatformIds,
        stateId,
        ageIds,
        genderIds,
        nccsIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        associationLevelId,
        costOfAssociation,
        reachMetrics,
        viewershipMetrics,
    } = req.validatedData as TCreateTeamSchema;

    await prisma.dashapp_team.create({
        data: {
            team_name: name ?? undefined,
            dashapp_sport: {
                connect: sportId ? { id: BigInt(sportId) } : undefined,
            },
            dashapp_leagueinfo: {
                connect: leagueId ? { id: BigInt(leagueId) } : undefined,
            },
            dashapp_team_owner: {
                connect: ownerIds?.map((ownerId) => ({
                    id: BigInt(ownerId),
                })),
            },
            year_of_inception: yearOfInception ?? undefined,
            franchise_fee: franchiseFee ?? undefined,
            dashapp_hqcity: {
                connect: cityId ? { id: BigInt(cityId) } : undefined,
            },
            dashapp_states: {
                connect: stateId
                    ? {
                          id: BigInt(stateId),
                      }
                    : undefined,
            },
            dashapp_team_personality_traits: subPersonalityTraitIds
                ? {
                      create: subPersonalityTraitIds?.map((traitId) => ({
                          dashapp_subpersonality: {
                              connect: { id: BigInt(traitId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_tier: tierIds
                ? {
                      create: tierIds?.map((tierId) => ({
                          dashapp_tier: {
                              connect: { id: BigInt(tierId) },
                          },
                      })),
                  }
                : undefined,
            strategy_overview: strategyOverview ?? undefined,
            dashapp_team_taglines: taglineIds
                ? {
                      create: taglineIds?.map((taglineId) => ({
                          dashapp_taglines: {
                              connect: { id: BigInt(taglineId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_active_campaigns: activeCampaignIds
                ? {
                      create: activeCampaignIds?.map((activeCampaignId) => ({
                          dashapp_activecampaigns: {
                              connect: { id: BigInt(activeCampaignId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_marketing_platforms_primary:
                primaryMarketingPlatformIds
                    ? {
                          create: primaryMarketingPlatformIds?.map(
                              (primaryMarketingPlatformId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              primaryMarketingPlatformId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_team_marketing_platforms_secondary:
                secondaryMarketingPlatformIds
                    ? {
                          create: secondaryMarketingPlatformIds?.map(
                              (secondaryMarketingPlatformId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              secondaryMarketingPlatformId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_team_age: ageIds
                ? {
                      create: ageIds?.map((ageId) => ({
                          dashapp_age: {
                              connect: { id: BigInt(ageId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_gender: genderIds
                ? {
                      create: genderIds?.map((genderId) => ({
                          dashapp_gender: {
                              connect: { id: BigInt(genderId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_income: nccsIds
                ? {
                      create: nccsIds?.map((nccsId) => ({
                          dashapp_nccs: {
                              connect: { id: BigInt(nccsId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_key_markets_primary: primaryMarketIds
                ? {
                      create: primaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_key_markets_secondary: secondaryMarketIds
                ? {
                      create: secondaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_key_markets_tertiary: tertiaryIds
                ? {
                      create: tertiaryIds?.map((tertiaryId) => ({
                          dashapp_states: {
                              connect: { id: BigInt(tertiaryId) },
                          },
                      })),
                  }
                : undefined,
            association:
                associationLevelId || costOfAssociation
                    ? {
                          create: {
                              association_level: associationLevelId
                                  ? {
                                        connect: {
                                            id: BigInt(associationLevelId),
                                        },
                                    }
                                  : undefined,
                              cost: costOfAssociation ?? undefined,
                          },
                      }
                    : undefined,
            dashapp_reach: reachMetrics
                ? {
                      create: reachMetrics.map((metric) => ({
                          reach: metric.reach,
                          year: metric.year,
                      })),
                  }
                : undefined,
            dashapp_viewership: viewershipMetrics
                ? {
                      create: viewershipMetrics.map((metric) => ({
                          viewership: metric.viewership,
                          viewship_type: metric.viewershipType,
                          year: metric.year,
                      })),
                  }
                : undefined,
            instagram,
            facebook,
            linkedin,
            twitter,
            youtube,
            website,
        },
        select: {
            id: true,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Team created",
    });
});

export const editTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.id;

    if (!teamId) {
        throw new BadRequestError("Team ID not found");
    }

    const {
        sportId,
        leagueId,
        ownerIds,
        yearOfInception,
        franchiseFee,
        subPersonalityTraitIds,
        instagram,
        facebook,
        linkedin,
        twitter,
        youtube,
        website,
        tierIds,
        strategyOverview,
        taglineIds,
        activeCampaignIds,
        ageIds,
        genderIds,
        nccsIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        associationLevelId,
        associationId,
        costOfAssociation,
        reachMetrics,
        viewershipMetrics,
        cityId,
        name,
        primaryMarketingPlatformIds,
        secondaryMarketingPlatformIds,
        stateId,
    } = req.validatedData as TEditTeamSchema;

    await prisma.dashapp_team.update({
        where: { id: Number(teamId) },
        data: {
            team_name: name,
            dashapp_sport: sportId
                ? { connect: { id: BigInt(sportId) } }
                : undefined,
            dashapp_leagueinfo: leagueId
                ? { connect: { id: BigInt(leagueId) } }
                : undefined,
            dashapp_team_owner: ownerIds
                ? {
                      connect: ownerIds.map((teamOwnerId) => ({
                          id: BigInt(teamOwnerId),
                      })),
                  }
                : undefined,
            year_of_inception: yearOfInception,
            franchise_fee: franchiseFee,
            dashapp_hqcity: cityId
                ? { connect: { id: BigInt(cityId) } }
                : undefined,
            dashapp_states: stateId
                ? { connect: { id: BigInt(stateId) } }
                : undefined,
            dashapp_team_personality_traits: subPersonalityTraitIds
                ? {
                      deleteMany: {},
                      create: subPersonalityTraitIds.map((traitId) => ({
                          dashapp_subpersonality: {
                              connect: { id: BigInt(traitId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_tier: tierIds
                ? {
                      deleteMany: {},
                      create: tierIds.map((tierId) => ({
                          dashapp_tier: { connect: { id: BigInt(tierId) } },
                      })),
                  }
                : undefined,
            strategy_overview: strategyOverview,
            dashapp_team_taglines: taglineIds
                ? {
                      deleteMany: {},
                      create: taglineIds.map((taglineId) => ({
                          dashapp_taglines: {
                              connect: { id: BigInt(taglineId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_active_campaigns: activeCampaignIds
                ? {
                      deleteMany: {},
                      create: activeCampaignIds.map((activeCampaignId) => ({
                          dashapp_activecampaigns: {
                              connect: { id: BigInt(activeCampaignId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_marketing_platforms_primary:
                primaryMarketingPlatformIds
                    ? {
                          deleteMany: {},
                          create: primaryMarketingPlatformIds.map(
                              (primaryMarketingPlatformId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              primaryMarketingPlatformId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_team_marketing_platforms_secondary:
                secondaryMarketingPlatformIds
                    ? {
                          deleteMany: {},
                          create: secondaryMarketingPlatformIds.map(
                              (secondaryMarketingPlatformId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              secondaryMarketingPlatformId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_team_age: ageIds
                ? {
                      deleteMany: {},
                      create: ageIds.map((ageId) => ({
                          dashapp_age: { connect: { id: BigInt(ageId) } },
                      })),
                  }
                : undefined,
            dashapp_team_gender: genderIds
                ? {
                      deleteMany: {},
                      create: genderIds.map((genderId) => ({
                          dashapp_gender: { connect: { id: BigInt(genderId) } },
                      })),
                  }
                : undefined,
            dashapp_team_income: nccsIds
                ? {
                      deleteMany: {},
                      create: nccsIds.map((nccsId) => ({
                          dashapp_nccs: { connect: { id: BigInt(nccsId) } },
                      })),
                  }
                : undefined,
            dashapp_team_key_markets_primary: primaryMarketIds
                ? {
                      deleteMany: {},
                      create: primaryMarketIds.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_key_markets_secondary: secondaryMarketIds
                ? {
                      deleteMany: {},
                      create: secondaryMarketIds.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_team_key_markets_tertiary: tertiaryIds
                ? {
                      deleteMany: {},
                      create: tertiaryIds.map((tertiaryId) => ({
                          dashapp_states: {
                              connect: { id: BigInt(tertiaryId) },
                          },
                      })),
                  }
                : undefined,
            association: associationId
                ? {
                      deleteMany: {},
                      create: {
                          association_level: associationLevelId
                              ? {
                                    connect: { id: BigInt(associationLevelId) },
                                }
                              : undefined,
                          cost: costOfAssociation ?? undefined,
                      },
                  }
                : undefined,
            dashapp_reach: reachMetrics
                ? {
                      deleteMany: reachMetrics.map((metric) => ({
                          year: metric.year,
                      })),
                      create: reachMetrics.map((metric) => ({
                          reach: metric.reach,
                          year: metric.year,
                      })),
                  }
                : undefined,
            dashapp_viewership: viewershipMetrics
                ? {
                      deleteMany: viewershipMetrics.map((metric) => ({
                          year: metric.year,
                      })),
                      create: viewershipMetrics.map((metric) => ({
                          viewership: metric.viewership,
                          viewship_type: metric.viewershipType,
                          year: metric.year,
                      })),
                  }
                : undefined,
            instagram,
            facebook,
            linkedin,
            twitter,
            youtube,
            website,
        },
        select: { id: true },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Team details updated",
    });
});

export const deleteTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.id;

    if (!teamId) {
        throw new BadRequestError("Team ID not found");
    }

    const deletedTeam = await prisma.dashapp_team.delete({
        where: { id: BigInt(teamId) },
        select: { id: true },
    });

    if (!deletedTeam?.id) {
        throw new NotFoundError("This team does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        message: "Team deleted",
    });
});

export const getFilteredTeam = asyncHandler(async (req, res) => {});
