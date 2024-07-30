import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { prisma } from "../db/index.js";
import { STATUS_CODE } from "../lib/constants.js";
import {
    TCreateLeagueSchema,
    TEditLeagueSchema,
} from "../schemas/league.schema.js";
import { leagueSelect } from "../types/league.type.js";
import { LeagueResponseDTO } from "../dto/league.dto.js";

export const getLeagueById = asyncHandler(async (req, res) => {
    const leagueId = req.params.id;

    if (!leagueId) {
        throw new BadRequestError("League ID not found");
    }

    const league = await prisma.dashapp_leagueinfo.findUnique({
        where: { id: BigInt(leagueId) },
        select: leagueSelect,
    });

    if (!league) {
        throw new NotFoundError("This league does not exists");
    }

    const leagueResponse: LeagueResponseDTO =
        LeagueResponseDTO.toResponse(league);

    res.status(STATUS_CODE.OK).json(leagueResponse);
});

export const getAllLeagues = asyncHandler(async (req, res) => {
    const leagues = await prisma.dashapp_leagueinfo.findMany({
        select: {
            id: true,
            property_name: true,
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

    if (!leagues) {
        throw new NotFoundError("League data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        leagues.map((league) => ({
            id: league.id,
            leagueName: league.property_name,
            createdDate: league.created_date,
            modifiedDate: league.modified_date,
            createdBy: {
                userId: league.created_by?.id,
                email: league.created_by?.email,
                firstName: league.created_by?.first_name,
                lastName: league.created_by?.last_name,
                username: league.created_by?.username,
            },
            modifiedBy: {
                userId: league.modified_by?.id,
                email: league.modified_by?.email,
                firstName: league.modified_by?.first_name,
                lastName: league.modified_by?.last_name,
                username: league.modified_by?.username,
            },
        })),
    );
});

export const createLeague = asyncHandler(async (req, res) => {
    const {
        propertyName,
        sportId,
        leagueOwnerIds,
        yearOfInception,
        formatId,
        broadCastPartnerId,
        ottPartnerId,
        personalityTraitIds,
        tierIds,
        instagram,
        facebook,
        linkedin,
        twitter,
        youtube,
        website,
        strategyOverview,
        taglineIds,
        activeCampaignIds,
        marketingPlatformPrimaryIds,
        marketingPlatformSecondaryIds,
        ageIds,
        genderIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        incomeIds,
        metrics,
        associationId,
    } = req.validatedData as TCreateLeagueSchema;

    await prisma.dashapp_leagueinfo.create({
        data: {
            property_name: propertyName,
            dashapp_sport: sportId
                ? {
                      connect: { id: BigInt(sportId) },
                  }
                : undefined,
            dashapp_leagueinfo_owner: {
                create: leagueOwnerIds?.map((ownerId) => ({
                    dashapp_leagueowner: { connect: { id: BigInt(ownerId) } },
                })),
            },
            year_of_inception: yearOfInception,
            format: formatId
                ? {
                      connect: { id: BigInt(formatId) },
                  }
                : undefined,
            dashapp_broadcastpartner: {
                connect: broadCastPartnerId
                    ? {
                          id: BigInt(broadCastPartnerId),
                      }
                    : undefined,
            },
            dashapp_ottpartner: {
                connect: ottPartnerId
                    ? {
                          id: BigInt(ottPartnerId),
                      }
                    : undefined,
            },
            dashapp_leagueinfo_personality_traits: {
                create: personalityTraitIds?.map((traitId) => ({
                    dashapp_subpersonality: {
                        connect: { id: BigInt(traitId) },
                    },
                })),
            },
            dashapp_leagueinfo_tier: {
                create: tierIds?.map((tierId) => ({
                    dashapp_tier: {
                        connect: { id: BigInt(tierId) },
                    },
                })),
            },
            instagram: instagram ?? "N/A",
            facebook: facebook ?? "N/A",
            linkedin: linkedin ?? "N/A",
            twitter: twitter ?? "N/A",
            youtube: youtube ?? "N/A",
            website: website ?? "N/A",
            strategy_overview: strategyOverview,
            dashapp_leagueinfo_taglines: {
                create: taglineIds?.map((taglineId) => ({
                    dashapp_taglines: {
                        connect: { id: BigInt(taglineId) },
                    },
                })),
            },
            dashapp_leagueinfo_active_campaigns: {
                create: activeCampaignIds?.map((activeCampaignId) => ({
                    dashapp_activecampaigns: {
                        connect: { id: BigInt(activeCampaignId) },
                    },
                })),
            },
            dashapp_leagueinfo_marketing_platforms_primary: {
                create: marketingPlatformPrimaryIds?.map(
                    (marketingPlatformPrimaryId) => ({
                        dashapp_marketingplatform: {
                            connect: { id: BigInt(marketingPlatformPrimaryId) },
                        },
                    }),
                ),
            },
            dashapp_leagueinfo_marketing_platforms_secondary: {
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
            dashapp_leagueinfo_age: {
                create: ageIds?.map((ageId) => ({
                    dashapp_age: {
                        connect: { id: BigInt(ageId) },
                    },
                })),
            },
            dashapp_leagueinfo_gender: {
                create: genderIds?.map((genderId) => ({
                    dashapp_gender: {
                        connect: { id: BigInt(genderId) },
                    },
                })),
            },
            dashapp_leagueinfo_income: {
                create: incomeIds?.map((incomeId) => ({
                    dashapp_income: {
                        connect: { id: BigInt(incomeId) },
                    },
                })),
            },
            dashapp_leagueinfo_key_markets_primary: {
                create: primaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_leagueinfo_key_markets_secondary: {
                create: secondaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_leagueinfo_key_markets_tertiary: {
                create: tertiaryIds?.map((tertiaryId) => ({
                    dashapp_states: { connect: { id: BigInt(tertiaryId) } },
                })),
            },
            dashapp_metric: {
                create: metrics?.map((metric) => ({
                    viewership: metric.viewership,
                    viewship_type: metric.viewshipType,
                    reach: metric.reach,
                    year: metric.year,
                })),
            },
            association: {
                connect: associationId
                    ? {
                          id: BigInt(associationId),
                      }
                    : undefined,
            },
        },
        select: {
            id: true,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "League created",
    });
});

export const editLeague = asyncHandler(async (req, res) => {
    const leagueId = req.params.id;

    if (!leagueId) {
        throw new BadRequestError("League ID not found");
    }

    const {
        propertyName,
        sportId,
        leagueOwnerIds,
        yearOfInception,
        formatId,
        broadCastPartnerId,
        ottPartnerId,
        personalityTraitIds,
        tierIds,
        instagram,
        facebook,
        linkedin,
        twitter,
        youtube,
        website,
        strategyOverview,
        taglineIds,
        activeCampaignIds,
        marketingPlatformPrimaryIds,
        marketingPlatformSecondaryIds,
        ageIds,
        genderIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        incomeIds,
        metrics,
        associationId,
    } = req.validatedData as TEditLeagueSchema;

    await prisma.dashapp_leagueinfo.update({
        where: {
            id: Number(leagueId),
        },
        data: {
            property_name: propertyName,
            dashapp_sport: sportId
                ? {
                      connect: { id: BigInt(sportId) },
                  }
                : undefined,
            dashapp_leagueinfo_owner: leagueOwnerIds
                ? {
                      deleteMany: {},
                      create: leagueOwnerIds.map((ownerId) => ({
                          dashapp_leagueowner: {
                              connect: { id: BigInt(ownerId) },
                          },
                      })),
                  }
                : undefined,
            year_of_inception: yearOfInception,
            format: formatId
                ? {
                      connect: { id: BigInt(formatId) },
                  }
                : undefined,
            dashapp_broadcastpartner: broadCastPartnerId
                ? {
                      connect: { id: BigInt(broadCastPartnerId) },
                  }
                : undefined,
            dashapp_ottpartner: ottPartnerId
                ? {
                      connect: { id: BigInt(ottPartnerId) },
                  }
                : undefined,
            dashapp_leagueinfo_personality_traits: personalityTraitIds
                ? {
                      deleteMany: {},
                      create: personalityTraitIds.map((traitId) => ({
                          dashapp_subpersonality: {
                              connect: { id: BigInt(traitId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_tier: tierIds
                ? {
                      deleteMany: {},
                      create: tierIds.map((tierId) => ({
                          dashapp_tier: { connect: { id: BigInt(tierId) } },
                      })),
                  }
                : undefined,
            instagram,
            facebook,
            linkedin,
            twitter,
            youtube,
            website,
            strategy_overview: strategyOverview,
            dashapp_leagueinfo_taglines: taglineIds
                ? {
                      deleteMany: {},
                      create: taglineIds.map((taglineId) => ({
                          dashapp_taglines: {
                              connect: { id: BigInt(taglineId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_active_campaigns: activeCampaignIds
                ? {
                      deleteMany: {},
                      create: activeCampaignIds.map((activeCampaignId) => ({
                          dashapp_activecampaigns: {
                              connect: { id: BigInt(activeCampaignId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_marketing_platforms_primary:
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
            dashapp_leagueinfo_marketing_platforms_secondary:
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
            dashapp_leagueinfo_age: ageIds
                ? {
                      deleteMany: {},
                      create: ageIds.map((ageId) => ({
                          dashapp_age: { connect: { id: BigInt(ageId) } },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_gender: genderIds
                ? {
                      deleteMany: {},
                      create: genderIds.map((genderId) => ({
                          dashapp_gender: { connect: { id: BigInt(genderId) } },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_income: incomeIds
                ? {
                      deleteMany: {},
                      create: incomeIds.map((incomeId) => ({
                          dashapp_income: { connect: { id: BigInt(incomeId) } },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_key_markets_primary: primaryMarketIds
                ? {
                      deleteMany: {},
                      create: primaryMarketIds.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_key_markets_secondary: secondaryMarketIds
                ? {
                      deleteMany: {},
                      create: secondaryMarketIds.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_key_markets_tertiary: tertiaryIds
                ? {
                      deleteMany: {},
                      create: tertiaryIds.map((tertiaryId) => ({
                          dashapp_states: {
                              connect: { id: BigInt(tertiaryId) },
                          },
                      })),
                  }
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
            association: associationId
                ? {
                      connect: { id: BigInt(associationId) },
                  }
                : undefined,
        },
        select: {
            id: true,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "League details updated",
    });
});

export const deleteLeague = asyncHandler(async (req, res) => {
    const leagueId = req.params.id;

    if (!leagueId) {
        throw new BadRequestError("League ID not found");
    }

    await prisma.dashapp_leagueinfo.delete({ where: { id: BigInt(leagueId) } });

    res.status(STATUS_CODE.OK).json({
        message: "League deleted",
    });
});
