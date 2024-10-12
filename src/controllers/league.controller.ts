import { Prisma } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { LeagueResponseDTO } from "../dto/league.dto.js";
import { METADATA_KEYS, STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { areElementsDistinct } from "../lib/helpers.js";
import { metadataStore } from "../managers/MetadataManager.js";
import { TCreateLeagueSchema, TEditLeagueSchema, TFilteredLeagueSchema } from "../schemas/league.schema.js";
import { leagueSelect } from "../types/league.type.js";
import { getCostQuery, getEndorsementQuery, getGenderQuery, getMetricsQuery } from "./constants/index.js";
import { getLeaguesCount } from "./dashboard/helpers.js";

export const getLeagues = async ({
    query,
    take,
    skip,
}: {
    query?: Prisma.dashapp_leagueinfoWhereInput;
    take?: any;
    skip?: any;
}) => {
    return await prisma.dashapp_leagueinfo.findMany({
        where: query || undefined,
        select: {
            id: true,
            property_name: true,
            created_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            dashapp_leagueinfo_gender: true,
            created_date: true,
            modified_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            modified_date: true,
        },
        orderBy: { modified_date: "desc" },
        take: Number.isNaN(Number(take)) ? undefined : Number(take),
        skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
    });
};

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

    const leagueResponse: LeagueResponseDTO = LeagueResponseDTO.toResponse(updatedLeague);

    res.status(STATUS_CODE.OK).json(leagueResponse);
});

export const getAllLeagues = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const leagues = await getLeagues({ skip, take });

    if (leagues.length < 1) {
        throw new NotFoundError("League data does not exists");
    }

    const count = await getLeaguesCount();

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
            count,
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
        const isDistinct = areElementsDistinct(association?.map((association) => association.associationLevelId));

        if (!isDistinct) {
            throw new BadRequestError("Association Level must be unique");
        }
    }

    if (endorsements?.length) {
        const isEndorsementsExists = await prisma.dashapp_leagueendorsements.findFirst({
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
            dashapp_leagueinfo_owner: ownerIds?.length
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
            dashapp_leagueinfo_personality_traits: subPersonalityTraitIds?.length
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
            instagram: instagram,
            facebook: facebook,
            linkedin: linkedin,
            twitter: twitter,
            youtube: youtube,
            website: website,
            strategy_overview: strategyOverview,
            dashapp_leagueinfo_taglines: taglineIds?.length
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
            dashapp_leagueinfo_active_campaigns: activeCampaignIds?.length
                ? {
                      create: activeCampaignIds?.map((activeCampaignId) => ({
                          dashapp_activecampaigns: {
                              connect: { id: BigInt(activeCampaignId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_marketing_platforms_primary: primaryMarketingPlatformIds?.length
                ? {
                      create: primaryMarketingPlatformIds?.map((primaryMarketingPlatformId) => ({
                          dashapp_marketingplatform: {
                              connect: {
                                  id: BigInt(primaryMarketingPlatformId),
                              },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_marketing_platforms_secondary: secondaryMarketingPlatformIds?.length
                ? {
                      create: secondaryMarketingPlatformIds?.map((secondaryMarketingPlatformId) => ({
                          dashapp_marketingplatform: {
                              connect: {
                                  id: BigInt(secondaryMarketingPlatformId),
                              },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_age: ageIds?.length
                ? {
                      create: ageIds?.map((ageId) => ({
                          dashapp_age: {
                              connect: { id: BigInt(ageId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_gender: genderIds?.length
                ? {
                      create: genderIds?.map((genderId) => ({
                          dashapp_gender: {
                              connect: { id: BigInt(genderId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_income: nccsIds?.length
                ? {
                      create: nccsIds?.map((nccsId) => ({
                          dashapp_nccs: {
                              connect: { id: BigInt(nccsId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_key_markets_primary: primaryMarketIds?.length
                ? {
                      create: primaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_key_markets_secondary: secondaryMarketIds?.length
                ? {
                      create: secondaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_leagueinfo_key_markets_tertiary: tertiaryIds?.length
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
                          cost: value.costOfAssociation,
                      })),
                  }
                : undefined,
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.LEAGUE, true);

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
        const isDistinct = areElementsDistinct(association?.map((association) => association.associationLevelId));

        if (!isDistinct) {
            throw new BadRequestError("Association Level must be unique");
        }
    }

    if (endorsements?.length) {
        const isDistinct = areElementsDistinct(endorsements?.map((endorse) => endorse.name));

        if (!isDistinct) {
            throw new BadRequestError("Endorsements must be unique");
        }
    }

    await prisma.dashapp_leagueinfo.update({
        where: {
            id: BigInt(leagueId),
        },
        data: {
            property_name: name,
            modified_by: { connect: { id: BigInt(userId) } },
            dashapp_sport: sportId
                ? {
                      connect: { id: BigInt(sportId) },
                  }
                : { disconnect: true },
            dashapp_leagueinfo_owner: {
                deleteMany: {},
                ...(ownerIds?.length
                    ? {
                          create: ownerIds.map((ownerId) => ({
                              dashapp_leagueowner: {
                                  connect: { id: BigInt(ownerId) },
                              },
                          })),
                      }
                    : undefined),
            },
            year_of_inception: yearOfInception,
            format: formatId
                ? {
                      connect: { id: BigInt(formatId) },
                  }
                : { disconnect: true },
            dashapp_broadcastpartner: broadCastPartnerId
                ? {
                      connect: { id: BigInt(broadCastPartnerId) },
                  }
                : { disconnect: true },
            dashapp_ottpartner: ottPartnerId
                ? {
                      connect: { id: BigInt(ottPartnerId) },
                  }
                : { disconnect: true },
            dashapp_leagueinfo_personality_traits: {
                deleteMany: {},
                ...(subPersonalityTraitIds?.length
                    ? {
                          create: subPersonalityTraitIds.map((traitId) => ({
                              dashapp_subpersonality: {
                                  connect: { id: BigInt(traitId) },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_tier: {
                deleteMany: {},
                ...(tierIds?.length
                    ? {
                          create: tierIds.map((tierId) => ({
                              dashapp_tier: { connect: { id: BigInt(tierId) } },
                          })),
                      }
                    : undefined),
            },
            instagram: instagram,
            facebook: facebook,
            linkedin: linkedin,
            twitter: twitter,
            youtube: youtube,
            website: website,
            strategy_overview: strategyOverview,
            dashapp_leagueinfo_taglines: {
                deleteMany: {},
                ...(taglineIds?.length
                    ? {
                          create: taglineIds.map((taglineId) => ({
                              dashapp_taglines: {
                                  connect: { id: BigInt(taglineId) },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueendorsements: {
                deleteMany: {},
                ...(endorsements?.length
                    ? {
                          create: endorsements.map((endorse) => ({
                              name: endorse.name,
                              active: endorse.active,
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_active_campaigns: {
                deleteMany: {},
                ...(activeCampaignIds?.length
                    ? {
                          create: activeCampaignIds.map((activeCampaignId) => ({
                              dashapp_activecampaigns: {
                                  connect: { id: BigInt(activeCampaignId) },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_marketing_platforms_primary: {
                deleteMany: {},
                ...(primaryMarketingPlatformIds?.length
                    ? {
                          create: primaryMarketingPlatformIds.map((primaryMarketingPlatformId) => ({
                              dashapp_marketingplatform: {
                                  connect: {
                                      id: BigInt(primaryMarketingPlatformId),
                                  },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_marketing_platforms_secondary: {
                deleteMany: {},
                ...(secondaryMarketingPlatformIds?.length
                    ? {
                          create: secondaryMarketingPlatformIds.map((secondaryMarketingPlatformId) => ({
                              dashapp_marketingplatform: {
                                  connect: {
                                      id: BigInt(secondaryMarketingPlatformId),
                                  },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_age: {
                deleteMany: {},
                ...(ageIds?.length
                    ? {
                          create: ageIds.map((ageId) => ({
                              dashapp_age: { connect: { id: BigInt(ageId) } },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_gender: {
                deleteMany: {},
                ...(genderIds?.length
                    ? {
                          create: genderIds.map((genderId) => ({
                              dashapp_gender: {
                                  connect: { id: BigInt(genderId) },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_income: {
                deleteMany: {},
                ...(nccsIds?.length
                    ? {
                          create: nccsIds.map((nccsId) => ({
                              dashapp_nccs: { connect: { id: BigInt(nccsId) } },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_key_markets_primary: {
                deleteMany: {},
                ...(primaryMarketIds?.length
                    ? {
                          create: primaryMarketIds.map((marketId) => ({
                              dashapp_keymarket: {
                                  connect: { id: BigInt(marketId) },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_key_markets_secondary: {
                deleteMany: {},
                ...(secondaryMarketIds?.length
                    ? {
                          create: secondaryMarketIds.map((marketId) => ({
                              dashapp_keymarket: {
                                  connect: { id: BigInt(marketId) },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_leagueinfo_key_markets_tertiary: {
                deleteMany: {},
                ...(tertiaryIds?.length
                    ? {
                          create: tertiaryIds.map((tertiaryId) => ({
                              dashapp_states: {
                                  connect: { id: BigInt(tertiaryId) },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_broadcast_partner_metrics: {
                deleteMany: {},
                ...(broadcastPartnerMetrics?.length
                    ? {
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
                    : undefined),
            },
            dashapp_ott_partner_metrics: {
                deleteMany: {},
                ...(ottPartnerMetrics?.length
                    ? {
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
                    : undefined),
            },
            dashapp_leagueinfo_association: {
                deleteMany: {},
                ...(association?.length
                    ? {
                          create: association.map((asso) => ({
                              association_level: {
                                  connect: {
                                      id: BigInt(asso.associationLevelId),
                                  },
                              },
                              cost: asso.costOfAssociation,
                          })),
                      }
                    : undefined),
            },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.LEAGUE, true);

    await prisma.dashapp_leaguecontact.deleteMany();

    if (contactPerson?.length) {
        const contactData = contactPerson.map((details) => ({
            contact_name: details.contactName,
            contact_designation: details.contactDesignation,
            contact_email: details.contactEmail,
            contact_no: details.contactNumber,
            contact_linkedin: details.contactLinkedin,
            league_id: BigInt(leagueId),
        }));
        await prisma.dashapp_leaguecontact.createMany({
            data: contactData,
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

    await prisma.dashapp_leagueinfo.delete({ where: { id: BigInt(leagueId) }, select: { id: true } });

    metadataStore.setHasUpdated(METADATA_KEYS.LEAGUE, true);

    res.status(STATUS_CODE.OK).json({
        message: "League deleted",
    });
});

export const getFilteredLeague = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const {
        isMandatory,
        activeCampaignIds,
        ageIds,
        associationLevelIds,
        broadCastPartnerIds,
        contactDesignation,
        contactEmail,
        contactLinkedin,
        contactName,
        contactNumber,
        costOfAssociation,
        facebook,
        formatIds,
        genderIds,
        ids,
        instagram,
        endorsement,
        linkedin,
        nccsIds,
        ottPartnerIds,
        ownerIds,
        partnerIdMetrics,
        primaryMarketIds,
        primaryMarketingPlatformIds,
        reachMetrics,
        secondaryMarketIds,
        secondaryMarketingPlatformIds,
        sportIds,
        strategyOverview,
        subPersonalityTraitIds,
        taglineIds,
        tertiaryIds,
        tierIds,
        twitter,
        viewershipMetrics,
        website,
        yearMetrics,
        yearOfInception,
        youtube,
    } = req.validatedData as TFilteredLeagueSchema;

    const filterConditions: Prisma.dashapp_leagueinfoWhereInput = {
        id: ids?.length ? { in: ids.map((id) => BigInt(id)) } : undefined,

        ...(reachMetrics?.partnerType === "broadcast" ||
        viewershipMetrics?.partnerType === "broadcast" ||
        yearMetrics?.partnerType === "broadcast" ||
        partnerIdMetrics?.partnerType === "broadcast"
            ? {
                  dashapp_broadcast_partner_metrics: {
                      some: getMetricsQuery(
                          "broadcast",
                          reachMetrics,
                          viewershipMetrics,
                          yearMetrics,
                          partnerIdMetrics,
                      ),
                  },
              }
            : undefined),

        ...(reachMetrics?.partnerType === "ott" ||
        viewershipMetrics?.partnerType === "ott" ||
        yearMetrics?.partnerType === "ott" ||
        partnerIdMetrics?.partnerType === "ott"
            ? {
                  dashapp_ott_partner_metrics: {
                      some: getMetricsQuery("ott", reachMetrics, viewershipMetrics, yearMetrics, partnerIdMetrics),
                  },
              }
            : undefined),

        dashapp_leagueinfo_association:
            associationLevelIds?.length || costOfAssociation?.cost?.length
                ? {
                      some: {
                          association_level_id: associationLevelIds?.length
                              ? {
                                    in: associationLevelIds.map((id) => BigInt(id)),
                                }
                              : undefined,
                          cost: costOfAssociation?.cost?.length ? getCostQuery(costOfAssociation) : undefined,
                      },
                  }
                : undefined,

        dashapp_broadcastpartner: broadCastPartnerIds?.length
            ? {
                  id: { in: broadCastPartnerIds.map((id) => BigInt(id)) },
              }
            : undefined,

        dashapp_ottpartner: ottPartnerIds?.length
            ? {
                  id: { in: ottPartnerIds.map((id) => BigInt(id)) },
              }
            : undefined,

        dashapp_leagueendorsements:
            endorsement?.name || endorsement?.isActive
                ? {
                      some: getEndorsementQuery(endorsement),
                  }
                : undefined,

        strategy_overview: strategyOverview
            ? {
                  contains: strategyOverview,
                  mode: "insensitive",
              }
            : undefined,

        year_of_inception: yearOfInception ? { contains: yearOfInception, mode: "insensitive" } : undefined,

        dashapp_sport: sportIds?.length
            ? {
                  id: { in: sportIds.map((id) => BigInt(id)) },
              }
            : undefined,

        dashapp_leagueinfo_age: ageIds?.length
            ? {
                  some: {
                      dashapp_age: {
                          id: { in: ageIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        facebook: facebook ? { contains: facebook, mode: "insensitive" } : undefined,
        instagram: instagram ? { contains: instagram, mode: "insensitive" } : undefined,
        twitter: twitter ? { contains: twitter, mode: "insensitive" } : undefined,
        linkedin: linkedin ? { contains: linkedin, mode: "insensitive" } : undefined,
        youtube: youtube ? { contains: youtube, mode: "insensitive" } : undefined,
        website: website ? { contains: website, mode: "insensitive" } : undefined,

        dashapp_leagueinfo_personality_traits: subPersonalityTraitIds?.length
            ? {
                  some: {
                      dashapp_subpersonality: {
                          id: {
                              in: subPersonalityTraitIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_gender: genderIds?.length
            ? {
                  every: {
                      dashapp_gender: await getGenderQuery(genderIds),
                  },
              }
            : undefined,

        dashapp_leagueinfo_income: nccsIds?.length
            ? {
                  some: {
                      dashapp_nccs: {
                          id: { in: nccsIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        format: formatIds?.length
            ? {
                  id: { in: formatIds.map((id) => BigInt(id)) },
              }
            : undefined,

        dashapp_leagueinfo_owner: ownerIds?.length
            ? {
                  some: {
                      dashapp_leagueowner: {
                          id: { in: ownerIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_taglines: taglineIds?.length
            ? {
                  some: {
                      dashapp_taglines: {
                          id: { in: taglineIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_key_markets_primary: primaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: { in: primaryMarketIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_key_markets_secondary: secondaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: {
                              in: secondaryMarketIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_key_markets_tertiary: tertiaryIds?.length
            ? {
                  some: {
                      dashapp_states: {
                          id: { in: tertiaryIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_tier: tierIds?.length
            ? {
                  some: {
                      dashapp_tier: {
                          id: { in: tierIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_active_campaigns: activeCampaignIds?.length
            ? {
                  some: {
                      dashapp_activecampaigns: {
                          id: { in: activeCampaignIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_marketing_platforms_primary: primaryMarketingPlatformIds?.length
            ? {
                  some: {
                      dashapp_marketingplatform: {
                          id: {
                              in: primaryMarketingPlatformIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_marketing_platforms_secondary: secondaryMarketingPlatformIds?.length
            ? {
                  some: {
                      dashapp_marketingplatform: {
                          id: {
                              in: secondaryMarketingPlatformIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_leaguecontact:
            contactName || contactDesignation || contactEmail || contactNumber || contactLinkedin
                ? {
                      some: {
                          contact_name: contactName
                              ? {
                                    contains: contactName,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_designation: contactDesignation
                              ? {
                                    contains: contactDesignation,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_email: contactEmail
                              ? {
                                    contains: contactEmail,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_no: contactNumber
                              ? {
                                    contains: contactNumber,
                                }
                              : undefined,
                          contact_linkedin: contactLinkedin
                              ? {
                                    contains: contactLinkedin,
                                    mode: "insensitive",
                                }
                              : undefined,
                      },
                  }
                : undefined,
    };

    const combinedFilterConditions = isMandatory
        ? filterConditions
        : {
              OR: Object.entries(filterConditions)
                  .filter(([_, condition]) => condition)
                  .map(([key, condition]) => ({ [key]: condition })),
          };

    const [leagues, count] = await Promise.all([
        getLeagues({ query: combinedFilterConditions, take, skip }),
        getLeaguesCount(),
    ]);

    if (leagues.length < 1) {
        throw new NotFoundError("No leagues found for the given filters");
    }

    const modifiedLeagues =
        genderIds?.length === 2 ? leagues.filter((league) => league.dashapp_leagueinfo_gender.length === 2) : leagues;

    res.status(STATUS_CODE.OK).json(
        modifiedLeagues.map((league) => ({
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
            count,
        })),
    );
});
