import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { STATUS_CODE } from "../lib/constants.js";
import { TCreateTeamSchema, TEditTeamSchema } from "../schemas/team.schema.js";

// TODO verify that the edit method is correct and contains all the required fields (AI generated)

export const getAllTeams = asyncHandler(async (req, res) => {
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
        },
    });

    if (teams.length < 1) {
        throw new NotFoundError("Team data does not exists");
    }

    res.status(STATUS_CODE.OK).json(teams);
});

export const getTeamById = asyncHandler(async (req, res) => {
    const teamId = req.params.id;

    if (!teamId) {
        throw new BadRequestError("Team ID not found");
    }

    const team = await prisma.dashapp_team.findUnique({
        where: { id: BigInt(teamId) },
    });

    if (!team) {
        throw new NotFoundError("This team does not exists");
    }

    res.status(STATUS_CODE.OK).json(team);
});

export const createTeam = asyncHandler(async (req, res) => {
    const {
        teamName,
        sportId,
        leagueId,
        teamOwnerIds,
        yearOfInception,
        franchiseFee,
        hqCityId,
        hqStateId,
        personalityTraitIds,
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
        marketingPlatformPrimaryIds,
        marketingPlatformSecondaryIds,
        ageIds,
        genderIds,
        incomeIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        associationId,
        metrics,
    } = req.validatedData as TCreateTeamSchema;

    await prisma.dashapp_team.create({
        data: {
            team_name: teamName,
            dashapp_sport: {
                connect: sportId ? { id: BigInt(sportId) } : undefined,
            },
            dashapp_leagueinfo: {
                connect: leagueId ? { id: BigInt(leagueId) } : undefined,
            },
            dashapp_team_owner: {
                connect: teamOwnerIds?.map((teamOwnerId) => ({
                    id: BigInt(teamOwnerId),
                })),
            },
            year_of_inception: yearOfInception,
            franchise_fee: franchiseFee,
            dashapp_hqcity: {
                connect: hqCityId ? { id: BigInt(hqCityId) } : undefined,
            },
            hq_state: {
                connect: hqStateId
                    ? {
                          id: BigInt(hqStateId),
                      }
                    : undefined,
            },
            dashapp_team_personality_traits: {
                create: personalityTraitIds?.map((traitId) => ({
                    dashapp_subpersonality: {
                        connect: { id: BigInt(traitId) },
                    },
                })),
            },
            dashapp_team_tier: {
                create: tierIds?.map((tierId) => ({
                    dashapp_tier: {
                        connect: { id: BigInt(tierId) },
                    },
                })),
            },
            strategy_overview: strategyOverview,
            dashapp_team_taglines: {
                create: taglineIds?.map((taglineId) => ({
                    dashapp_taglines: {
                        connect: { id: BigInt(taglineId) },
                    },
                })),
            },
            dashapp_team_active_campaigns: {
                create: activeCampaignIds?.map((activeCampaignId) => ({
                    dashapp_activecampaigns: {
                        connect: { id: BigInt(activeCampaignId) },
                    },
                })),
            },
            dashapp_team_marketing_platforms_primary: {
                create: marketingPlatformPrimaryIds?.map(
                    (marketingPlatformPrimaryId) => ({
                        dashapp_marketingplatform: {
                            connect: { id: BigInt(marketingPlatformPrimaryId) },
                        },
                    }),
                ),
            },
            dashapp_team_marketing_platforms_secondary: {
                create: marketingPlatformSecondaryIds?.map(
                    (marketingPlatformSecondaryId) => ({
                        dashapp_marketingplatform: {
                            connect: {
                                id: BigInt(marketingPlatformSecondaryId),
                            },
                        },
                    }),
                ),
            },
            dashapp_team_age: {
                create: ageIds?.map((ageId) => ({
                    dashapp_age: {
                        connect: { id: BigInt(ageId) },
                    },
                })),
            },
            dashapp_team_gender: {
                create: genderIds?.map((genderId) => ({
                    dashapp_gender: {
                        connect: { id: BigInt(genderId) },
                    },
                })),
            },
            dashapp_team_income: {
                create: incomeIds?.map((incomeId) => ({
                    dashapp_income: {
                        connect: { id: BigInt(incomeId) },
                    },
                })),
            },
            dashapp_team_key_markets_primary: {
                create: primaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_team_key_markets_secondary: {
                create: secondaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_team_key_markets_tertiary: {
                create: tertiaryIds?.map((tertiaryId) => ({
                    dashapp_states: { connect: { id: BigInt(tertiaryId) } },
                })),
            },
            association: {
                connect: associationId
                    ? {
                          id: BigInt(associationId),
                      }
                    : undefined,
            },
            dashapp_metric: {
                create: metrics?.map((metric) => ({
                    viewership: metric.viewership,
                    viewship_type: metric.viewshipType,
                    reach: metric.reach,
                    year: metric.year,
                })),
            },
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

    res.status(STATUS_CODE.OK).send("Team created");
});

export const editTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.id;

    if (!teamId) {
        throw new BadRequestError("Team ID not found");
    }

    const {
        teamName,
        sportId,
        leagueId,
        teamOwnerIds,
        yearOfInception,
        franchiseFee,
        hqCityId,
        hqStateId,
        personalityTraitIds,
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
        marketingPlatformPrimaryIds,
        marketingPlatformSecondaryIds,
        ageIds,
        genderIds,
        incomeIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        associationId,
        metrics,
    } = req.validatedData as TEditTeamSchema;

    await prisma.dashapp_team.update({
        where: { id: Number(teamId) },
        data: {
            team_name: teamName,
            dashapp_sport: sportId
                ? { connect: { id: BigInt(sportId) } }
                : undefined,
            dashapp_leagueinfo: leagueId
                ? { connect: { id: BigInt(leagueId) } }
                : undefined,
            dashapp_team_owner: teamOwnerIds
                ? {
                      connect: teamOwnerIds.map((teamOwnerId) => ({
                          id: BigInt(teamOwnerId),
                      })),
                  }
                : undefined,
            year_of_inception: yearOfInception,
            franchise_fee: franchiseFee,
            dashapp_hqcity: hqCityId
                ? { connect: { id: BigInt(hqCityId) } }
                : undefined,
            hq_state: hqStateId
                ? { connect: { id: BigInt(hqStateId) } }
                : undefined,
            dashapp_team_personality_traits: personalityTraitIds
                ? {
                      deleteMany: {},
                      create: personalityTraitIds.map((traitId) => ({
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
                marketingPlatformPrimaryIds
                    ? {
                          deleteMany: {},
                          create: marketingPlatformPrimaryIds.map(
                              (marketingPlatformPrimaryId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              marketingPlatformPrimaryId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_team_marketing_platforms_secondary:
                marketingPlatformSecondaryIds
                    ? {
                          deleteMany: {},
                          create: marketingPlatformSecondaryIds.map(
                              (marketingPlatformSecondaryId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              marketingPlatformSecondaryId,
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
            dashapp_team_income: incomeIds
                ? {
                      deleteMany: {},
                      create: incomeIds.map((incomeId) => ({
                          dashapp_income: { connect: { id: BigInt(incomeId) } },
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
                ? { connect: { id: BigInt(associationId) } }
                : undefined,
            dashapp_metric: metrics
                ? {
                      deleteMany: {},
                      create: metrics.map((metric) => ({
                          viewership: metric.viewership,
                          viewship_type: metric.viewshipType,
                          reach: metric.reach,
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

    res.status(STATUS_CODE.OK).send("Team updated");
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

    if (!deletedTeam) {
        throw new NotFoundError("This team does not exists");
    }

    res.status(STATUS_CODE.OK).send("Team deleted");
});
