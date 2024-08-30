import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { LeagueResponseDTO } from "../dto/league.dto.js";
import { STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { areElementsDistinct } from "../lib/helpers.js";
import {
    TCreateLeagueSchema,
    TEditLeagueSchema,
} from "../schemas/league.schema.js";
import { leagueSelect } from "../types/league.type.js";
import { getLeaguesCount } from "./dashboard/helpers.js";

export const getLeagueById = asyncHandler(async (req, res) => {
    const leagueId = req.params.id;

    if (!leagueId) {
        throw new BadRequestError("League ID not found");
    }

    const league = await prisma.dashapp_leagueinfo.findUnique({
        where: { id: BigInt(leagueId) },
        select: leagueSelect,
    });

    if (!league?.id) {
        throw new NotFoundError("This league does not exists");
    }

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_leagueinfo_personality_traits: {
                        some: { leagueinfo_id: BigInt(leagueId) },
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            dashapp_subpersonality: {
                where: {
                    dashapp_leagueinfo_personality_traits: {
                        some: {
                            leagueinfo_id: BigInt(leagueId),
                        },
                    },
                },
            },
        },
    });

    const updatedLeague = {
        ...league,
        mainPersonalities,
    };

    const leagueResponse: LeagueResponseDTO =
        LeagueResponseDTO.toResponse(updatedLeague);

    res.status(STATUS_CODE.OK).json(leagueResponse);
});

export const getAllLeagues = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const leagues = await prisma.dashapp_leagueinfo.findMany({
        select: {
            id: true,
            property_name: true,
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

    if (leagues.length < 1) {
        throw new NotFoundError("League data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        leagues.map((league) => ({
            id: league.id,
            name: league.property_name,
            createdDate: league.created_date,
            modifiedDate: league.modified_date,
            createdBy: {
                userId: league.created_by?.id,
                email: league.created_by?.email,
            },
            modifiedBy: {
                userId: league.modified_by?.id,
                email: league.modified_by?.email,
            },
            count: league._count,
        })),
    );
});

export const getTotalLeagues = asyncHandler(async (req, res) => {
    const count = getLeaguesCount();
    res.status(STATUS_CODE.OK).json({
        count,
    });
});

export const createLeague = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const {
        name,
        sportId,
        ownerIds,
        yearOfInception,
        formatId,
        broadCastPartnerId,
        ottPartnerId,
        subPersonalityTraitIds,
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
        primaryMarketingPlatformIds,
        secondaryMarketingPlatformIds,
        ageIds,
        genderIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        nccsIds,
        association,
        contactPerson,
        endorsements,
        broadcastPartnerMetrics,
        ottPartnerMetrics,
    } = req.validatedData as TCreateLeagueSchema;

    if (association?.length) {
        const isDistinct = areElementsDistinct(
            association?.map((association) => association.associationLevelId),
        );

        if (!isDistinct) {
            throw new BadRequestError("Association Level must be unique");
        }
    }

    const isEndorsementsExists =
        await prisma.dashapp_leagueendorsements.findFirst({
            where: {
                name: { in: endorsements?.map((endorse) => endorse.name) },
            },
            select: {
                name: true,
            },
        });

    if (isEndorsementsExists?.name) {
        res.status(STATUS_CODE.CONFLICT).json({
            key: isEndorsementsExists.name,
            message: "This endorsement already exists",
        });
        return;
    }

    const league = await prisma.dashapp_leagueinfo.create({
        data: {
            property_name: name,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
            dashapp_sport: sportId
                ? {
                      connect: { id: BigInt(sportId) },
                  }
                : undefined,
            dashapp_leagueinfo_owner: ownerIds
                ? {
                      create: ownerIds?.map((ownerId) => ({
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
                      connect: {
                          id: BigInt(broadCastPartnerId),
                      },
                  }
                : undefined,
            dashapp_ottpartner: ottPartnerId
                ? {
                      connect: {
                          id: BigInt(ottPartnerId),
                      },
                  }
                : undefined,
            dashapp_leagueinfo_personality_traits: subPersonalityTraitIds
                ? {
                      create: subPersonalityTraitIds?.map((traitId) => ({
                          dashapp_subpersonality: {
                              connect: { id: BigInt(traitId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_tier: tierIds?.length
                ? {
                      create: tierIds?.map((tierId) => ({
                          dashapp_tier: {
                              connect: { id: BigInt(tierId) },
                          },
                      })),
                  }
                : undefined,
            instagram: instagram || undefined,
            facebook: facebook || undefined,
            linkedin: linkedin || undefined,
            twitter: twitter || undefined,
            youtube: youtube || undefined,
            website: website || undefined,
            strategy_overview: strategyOverview || undefined,
            dashapp_leagueinfo_taglines: taglineIds
                ? {
                      create: taglineIds?.map((taglineId) => ({
                          dashapp_taglines: {
                              connect: { id: BigInt(taglineId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueendorsements: endorsements?.length
                ? {
                      create: endorsements.map((endorse) => ({
                          name: endorse.name,
                          active: endorse.active,
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_active_campaigns: activeCampaignIds
                ? {
                      create: activeCampaignIds?.map((activeCampaignId) => ({
                          dashapp_activecampaigns: {
                              connect: { id: BigInt(activeCampaignId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_marketing_platforms_primary:
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
            dashapp_leagueinfo_marketing_platforms_secondary:
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
            dashapp_leagueinfo_age: ageIds
                ? {
                      create: ageIds?.map((ageId) => ({
                          dashapp_age: {
                              connect: { id: BigInt(ageId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_gender: genderIds
                ? {
                      create: genderIds?.map((genderId) => ({
                          dashapp_gender: {
                              connect: { id: BigInt(genderId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_income: nccsIds
                ? {
                      create: nccsIds?.map((nccsId) => ({
                          dashapp_nccs: {
                              connect: { id: BigInt(nccsId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_key_markets_primary: primaryMarketIds
                ? {
                      create: primaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_key_markets_secondary: secondaryMarketIds
                ? {
                      create: secondaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_key_markets_tertiary: tertiaryIds
                ? {
                      create: tertiaryIds?.map((tertiaryId) => ({
                          dashapp_states: {
                              connect: { id: BigInt(tertiaryId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_broadcast_partner_metrics: broadcastPartnerMetrics?.length
                ? {
                      create: broadcastPartnerMetrics.map((metric) => ({
                          viewership: metric.viewership || undefined,
                          reach: metric.reach || undefined,
                          year: metric.year,
                          dashapp_broadcastpartner: {
                              connect: {
                                  id: BigInt(metric.broadcastPartnerId),
                              },
                          },
                          created_by: { connect: { id: BigInt(userId) } },
                      })),
                  }
                : undefined,
            dashapp_ott_partner_metrics: ottPartnerMetrics?.length
                ? {
                      create: ottPartnerMetrics.map((metric) => ({
                          viewership: metric.viewership || undefined,
                          reach: metric.reach || undefined,
                          year: metric.year,
                          dashapp_ottpartner: {
                              connect: {
                                  id: BigInt(metric.ottPartnerId),
                              },
                          },
                          created_by: { connect: { id: BigInt(userId) } },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_association: association?.length
                ? {
                      create: association.map((value) => ({
                          association_level: value.associationLevelId
                              ? {
                                    connect: {
                                        id: BigInt(value.associationLevelId),
                                    },
                                }
                              : undefined,
                          cost: value.costOfAssociation || undefined,
                      })),
                  }
                : undefined,
        },
        select: {
            id: true,
        },
    });

    if (contactPerson?.length) {
        await prisma.dashapp_leaguecontact.createMany({
            data: contactPerson.map((details) => ({
                contact_name: details.contactName,
                contact_designation: details.contactDesignation || undefined,
                contact_email: details.contactEmail || undefined,
                contact_no: details.contactNumber || undefined,
                contact_linkedin: details.contactLinkedin || undefined,
                league_id: league.id,
            })),
        });
    }

    res.status(STATUS_CODE.OK).json({
        message: "League created",
    });
});

export const editLeague = asyncHandler(async (req, res) => {
    const leagueId = req.params.id;

    if (!leagueId) {
        throw new BadRequestError("League ID not found");
    }

    const leagueExists = await prisma.dashapp_leagueinfo.findUnique({
        where: { id: BigInt(leagueId) },
        select: { id: true },
    });

    if (!leagueExists?.id) {
        throw new NotFoundError("This league does not exists");
    }

    const userId = req.user.userId;

    const {
        name,
        sportId,
        ownerIds,
        yearOfInception,
        formatId,
        broadCastPartnerId,
        ottPartnerId,
        subPersonalityTraitIds,
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
        primaryMarketingPlatformIds,
        secondaryMarketingPlatformIds,
        ageIds,
        genderIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        nccsIds,
        association,
        contactPerson,
        endorsements,
        broadcastPartnerMetrics,
        ottPartnerMetrics,
    } = req.validatedData as TEditLeagueSchema;

    if (association?.length) {
        const isDistinct = areElementsDistinct(
            association?.map((association) => association.associationLevelId),
        );

        if (!isDistinct) {
            throw new BadRequestError("Association Level must be unique");
        }
    }

    await prisma.dashapp_leagueinfo.update({
        where: {
            id: BigInt(leagueId),
        },
        data: {
            property_name: name || undefined,
            modified_by: { connect: { id: BigInt(userId) } },
            dashapp_sport: sportId
                ? {
                      connect: { id: BigInt(sportId) },
                  }
                : undefined,
            dashapp_leagueinfo_owner: ownerIds
                ? {
                      deleteMany: {},
                      create: ownerIds.map((ownerId) => ({
                          dashapp_leagueowner: {
                              connect: { id: BigInt(ownerId) },
                          },
                      })),
                  }
                : undefined,
            year_of_inception: yearOfInception || undefined,
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
            dashapp_leagueinfo_personality_traits: subPersonalityTraitIds
                ? {
                      deleteMany: {},
                      create: subPersonalityTraitIds.map((traitId) => ({
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
            instagram: instagram || undefined,
            facebook: facebook || undefined,
            linkedin: linkedin || undefined,
            twitter: twitter || undefined,
            youtube: youtube || undefined,
            website: website || undefined,
            strategy_overview: strategyOverview || undefined,
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
            dashapp_leagueendorsements: endorsements?.length
                ? {
                      deleteMany: {},
                      create: endorsements.map((endorse) => ({
                          name: endorse.name,
                          active: endorse.active,
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
            dashapp_leagueinfo_marketing_platforms_secondary:
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
            dashapp_leagueinfo_income: nccsIds
                ? {
                      deleteMany: {},
                      create: nccsIds.map((nccsId) => ({
                          dashapp_nccs: { connect: { id: BigInt(nccsId) } },
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
            dashapp_broadcast_partner_metrics: broadcastPartnerMetrics?.length
                ? {
                      deleteMany: {},
                      create: broadcastPartnerMetrics.map((metric) => ({
                          viewership: metric.viewership,
                          reach: metric.reach,
                          year: metric.year,
                          dashapp_broadcastpartner: {
                              connect: {
                                  id: BigInt(metric.broadcastPartnerId),
                              },
                          },
                          modified_by: { connect: { id: BigInt(userId) } },
                      })),
                  }
                : undefined,
            dashapp_ott_partner_metrics: ottPartnerMetrics?.length
                ? {
                      deleteMany: {},
                      create: ottPartnerMetrics.map((metric) => ({
                          viewership: metric.viewership,
                          reach: metric.reach,
                          year: metric.year,
                          dashapp_ottpartner: {
                              connect: {
                                  id: BigInt(metric.ottPartnerId),
                              },
                          },
                          modified_by: { connect: { id: BigInt(userId) } },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_association: {
                deleteMany: {},
                create: association?.length
                    ? association.map((asso) => ({
                          association_level: asso.associationLevelId
                              ? {
                                    connect: {
                                        id: BigInt(asso.associationLevelId),
                                    },
                                }
                              : undefined,
                          cost: asso.costOfAssociation || undefined,
                      }))
                    : undefined,
            },
        },
        select: {
            id: true,
        },
    });

    if (contactPerson?.length) {
        await prisma.dashapp_leaguecontact.deleteMany({
            where: {
                AND: [
                    {
                        id: {
                            notIn: contactPerson.map((details) =>
                                BigInt(details.contactId || ""),
                            ),
                        },
                    },
                    {
                        league_id: BigInt(leagueId),
                    },
                ],
            },
        });

        for (const details of contactPerson) {
            await prisma.dashapp_leaguecontact.upsert({
                where: { id: BigInt(details.contactId || "") },
                create: {
                    contact_name: details.contactName,
                    contact_designation:
                        details.contactDesignation || undefined,
                    contact_email: details.contactEmail || undefined,
                    contact_no: details.contactNumber || undefined,
                    contact_linkedin: details.contactLinkedin || undefined,
                    dashapp_leagueinfo: {
                        connect: {
                            id: BigInt(leagueId),
                        },
                    },
                },
                update: {
                    contact_name: details.contactName || undefined,
                    contact_designation:
                        details.contactDesignation || undefined,
                    contact_email: details.contactEmail || undefined,
                    contact_no: details.contactNumber || undefined,
                    contact_linkedin: details.contactLinkedin || undefined,
                },
            });
        }
    } else {
        await prisma.dashapp_leaguecontact.deleteMany({
            where: { league_id: BigInt(leagueId) },
        });
    }

    res.status(STATUS_CODE.OK).json({
        message: "League details updated",
    });
});

export const deleteLeague = asyncHandler(async (req, res) => {
    const leagueId = req.params.id;

    if (!leagueId) {
        throw new BadRequestError("League ID not found");
    }

    const leagueExists = await prisma.dashapp_leagueinfo.findUnique({
        where: { id: BigInt(leagueId) },
        select: { id: true },
    });

    if (!leagueExists?.id) {
        throw new NotFoundError("This league does not exists");
    }

    await prisma.dashapp_leagueinfo.delete({ where: { id: BigInt(leagueId) } });

    res.status(STATUS_CODE.OK).json({
        message: "League deleted",
    });
});

export const getFilteredLeague = asyncHandler(async (req, res) => {});
