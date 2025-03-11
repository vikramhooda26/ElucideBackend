import { Prisma } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { TeamResponseDTO } from "../dto/team.dto.js";
import { METADATA_KEYS, STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { areElementsDistinct } from "../lib/helpers.js";
import { metadataStore } from "../managers/MetadataManager.js";
import { TCreateTeamSchema, TEditTeamSchema, TFilteredTeamSchema } from "../schemas/team.schema.js";
import { teamSelect, TTeamDetails } from "../types/team.type.js";
import {
    exactSetMatch,
    getCostQuery,
    getEndorsementQuery,
    getGenderQuery,
    getMetricsQuery,
} from "./constants/index.js";
import { getTeamsCount } from "./dashboard/helpers.js";

export const getTeams = async ({
    query,
    take,
    skip,
    select,
}: {
    query?: Prisma.dashapp_teamWhereInput;
    take?: any;
    skip?: any;
    select: Prisma.dashapp_teamSelect;
}) => {
    return await prisma.dashapp_team.findMany({
        where: query || undefined,
        select: select,
        orderBy: { modified_date: "desc" },
        take: Number.isNaN(Number(take)) ? undefined : Number(take),
        skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
    });
};

export const getAllTeams = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const selectTeam = {
        id: true,
        team_name: true,
        created_by: {
            select: {
                id: true,
                email: true,
            },
        },
        dashapp_team_gender: true,
        created_date: true,
        modified_by: {
            select: {
                id: true,
                email: true,
            },
        },
        modified_date: true,
    };

    const teams = await getTeams({ skip, take, select: selectTeam });

    if (teams.length < 1) {
        throw new NotFoundError("Team data does not exists");
    }

    const count = await getTeamsCount();

    res.status(STATUS_CODE.OK).json(
        teams.map((team) => ({
            id: team.id,
            name: team.team_name,
            createdDate: team.created_date,
            modifiedDate: team.modified_date,
            createdBy: {
                userId: team.created_by?.id,
                email: team.created_by?.email,
            },
            modifiedBy: {
                userId: team.modified_by?.id,
                email: team.modified_by?.email,
            },
            count,
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

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_team_personality_traits: {
                        some: { team_id: BigInt(teamId) },
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            dashapp_subpersonality: {
                where: {
                    dashapp_team_personality_traits: {
                        some: {
                            team_id: BigInt(teamId),
                        },
                    },
                },
            },
        },
    });

    const updatedTeam = {
        ...team,
        mainPersonalities,
    };

    const teamResponse: TeamResponseDTO = TeamResponseDTO.toResponse(updatedTeam);

    res.status(STATUS_CODE.OK).json(teamResponse);
});

export const getTotalTeams = asyncHandler(async (req, res) => {
    const count = getTeamsCount();

    res.status(STATUS_CODE.OK).json({ count });
});

export const createTeam = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

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
        association,
        contactPerson,
        endorsements,
        broadcastPartnerMetrics,
        ottPartnerMetrics,
    } = req.validatedData as TCreateTeamSchema;

    if (endorsements?.length) {
        const isEndorsementsExists = await prisma.dashapp_teamendorsements.findFirst({
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

    const team = await prisma.dashapp_team.create({
        data: {
            team_name: name,
            created_by: {
                connect: { id: BigInt(userId) },
            },
            modified_by: {
                connect: { id: BigInt(userId) },
            },
            dashapp_sport: sportId
                ? {
                      connect: { id: BigInt(sportId) },
                  }
                : undefined,
            dashapp_leagueinfo: leagueId
                ? {
                      connect: { id: BigInt(leagueId) },
                  }
                : undefined,
            dashapp_team_owner: ownerIds?.length
                ? {
                      create: ownerIds.map((ownerId) => ({
                          dashapp_teamowner: {
                              connect: {
                                  id: BigInt(ownerId),
                              },
                          },
                      })),
                  }
                : undefined,
            year_of_inception: yearOfInception || undefined,
            franchise_fee: franchiseFee || undefined,
            dashapp_teamendorsements: endorsements?.length
                ? {
                      create: endorsements.map((endorse) => ({
                          name: endorse.name,
                          active: endorse.active,
                      })),
                  }
                : undefined,
            dashapp_hqcity: cityId
                ? {
                      connect: { id: BigInt(cityId) },
                  }
                : undefined,
            dashapp_states: stateId
                ? {
                      connect: {
                          id: BigInt(stateId),
                      },
                  }
                : undefined,
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
            strategy_overview: strategyOverview || undefined,
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
            dashapp_team_marketing_platforms_primary: primaryMarketingPlatformIds
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
            dashapp_team_marketing_platforms_secondary: secondaryMarketingPlatformIds
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
            dashapp_team_association: association?.length
                ? {
                      create: association.map((value) => ({
                          association_level: value.associationLevelId
                              ? {
                                    connect: {
                                        id: BigInt(value.associationLevelId),
                                    },
                                }
                              : undefined,
                          dashapp_brand_association: value.brandIds?.length
                              ? {
                                    create: value.brandIds.map((brandId) => ({
                                        brand: {
                                            connect: {
                                                id: BigInt(brandId),
                                            },
                                        },
                                    })),
                                }
                              : undefined,
                          cost: value.costOfAssociation || undefined,
                      })),
                  }
                : undefined,
            dashapp_broadcast_partner_metrics: broadcastPartnerMetrics?.length
                ? {
                      create: broadcastPartnerMetrics.map((metric) => ({
                          reach: metric.reach,
                          viewership: metric.viewership,
                          year: metric.year,
                          dashapp_broadcastpartner: {
                              connect: {
                                  id: BigInt(metric.broadcastPartnerId),
                              },
                          },
                          created_by: { connect: { id: BigInt(userId) } },
                          modified_by: { connect: { id: BigInt(userId) } },
                      })),
                  }
                : undefined,
            dashapp_ott_partner_metrics: ottPartnerMetrics?.length
                ? {
                      create: ottPartnerMetrics.map((metric) => ({
                          reach: metric.reach,
                          viewership: metric.viewership,
                          year: metric.year,
                          dashapp_ottpartner: {
                              connect: {
                                  id: BigInt(metric.ottPartnerId),
                              },
                          },
                          created_by: { connect: { id: BigInt(userId) } },
                          modified_by: { connect: { id: BigInt(userId) } },
                      })),
                  }
                : undefined,
            instagram: instagram || undefined,
            facebook: facebook || undefined,
            linkedin: linkedin || undefined,
            twitter: twitter || undefined,
            youtube: youtube || undefined,
            website: website || undefined,
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TEAM, true);

    if (contactPerson?.length) {
        await prisma.dashapp_teamcontact.createMany({
            data: contactPerson.map((details) => ({
                contact_name: details.contactName,
                contact_designation: details.contactDesignation || undefined,
                contact_email: details.contactEmail || undefined,
                contact_no: details.contactNumber || undefined,
                contact_linkedin: details.contactLinkedin || undefined,
                team_id: team.id,
            })),
        });
    }

    res.status(STATUS_CODE.OK).json({
        message: "Team created",
    });
});

export const editTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.id;

    if (!teamId) {
        throw new BadRequestError("Team ID not found");
    }

    const teamExists = await prisma.dashapp_team.findUnique({
        where: { id: BigInt(teamId) },
        select: { id: true },
    });

    if (!teamExists?.id) {
        throw new NotFoundError("This team does not exists");
    }

    const userId = req.user.userId;

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
        association,
        cityId,
        name,
        primaryMarketingPlatformIds,
        secondaryMarketingPlatformIds,
        stateId,
        contactPerson,
        endorsements,
        broadcastPartnerMetrics,
        ottPartnerMetrics,
    } = req.validatedData as TEditTeamSchema;

    if (association?.length) {
        const isDistinct = areElementsDistinct(association?.map((value) => value.associationLevelId));

        if (!isDistinct) {
            throw new BadRequestError("Association level must be unique");
        }
    }

    if (endorsements?.length) {
        const isDistinct = areElementsDistinct(endorsements?.map((endorse) => endorse.name));

        if (!isDistinct) {
            throw new BadRequestError("Endorsements must be unique");
        }
    }

    await prisma.dashapp_team.update({
        where: { id: BigInt(teamId) },
        data: {
            team_name: name,
            modified_by: {
                connect: { id: BigInt(userId) },
            },
            dashapp_sport: sportId ? { connect: { id: BigInt(sportId) } } : { disconnect: true },
            dashapp_leagueinfo: leagueId ? { connect: { id: BigInt(leagueId) } } : { disconnect: true },
            dashapp_team_owner: {
                deleteMany: {},
                ...(ownerIds?.length
                    ? {
                          create: ownerIds.map((ownerId) => ({
                              dashapp_teamowner: {
                                  connect: { id: BigInt(ownerId) },
                              },
                          })),
                      }
                    : undefined),
            },
            year_of_inception: yearOfInception,
            franchise_fee: franchiseFee,
            dashapp_hqcity: cityId ? { connect: { id: BigInt(cityId) } } : { disconnect: true },
            dashapp_states: stateId ? { connect: { id: BigInt(stateId) } } : { disconnect: true },
            dashapp_team_personality_traits: {
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
            dashapp_team_tier: {
                deleteMany: {},
                ...(tierIds?.length
                    ? {
                          create: tierIds.map((tierId) => ({
                              dashapp_tier: {
                                  connect: { id: BigInt(tierId) },
                              },
                          })),
                      }
                    : undefined),
            },
            strategy_overview: strategyOverview,
            dashapp_team_taglines: {
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
            dashapp_team_active_campaigns: {
                deleteMany: {},
                ...(activeCampaignIds?.length
                    ? {
                          create: activeCampaignIds.map((activeCampaignId) => ({
                              dashapp_activecampaigns: {
                                  connect: {
                                      id: BigInt(activeCampaignId),
                                  },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_teamendorsements: {
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
            dashapp_team_marketing_platforms_primary: {
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
            dashapp_team_marketing_platforms_secondary: {
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
            dashapp_team_age: {
                deleteMany: {},
                ...(ageIds?.length
                    ? {
                          create: ageIds.map((ageId) => ({
                              dashapp_age: {
                                  connect: { id: BigInt(ageId) },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_team_gender: {
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
            dashapp_team_income: {
                deleteMany: {},
                ...(nccsIds?.length
                    ? {
                          create: nccsIds.map((nccsId) => ({
                              dashapp_nccs: {
                                  connect: { id: BigInt(nccsId) },
                              },
                          })),
                      }
                    : undefined),
            },
            dashapp_team_key_markets_primary: {
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
            dashapp_team_key_markets_secondary: {
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
            dashapp_team_key_markets_tertiary: {
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
            dashapp_team_association: {
                deleteMany: {},
                ...(association?.length
                    ? {
                          create: association?.map((value) => ({
                              association_level: {
                                  connect: {
                                      id: BigInt(value.associationLevelId),
                                  },
                              },
                              dashapp_brand_association: value.brandIds?.length
                                  ? {
                                        create: value.brandIds.map((brandId) => ({
                                            brand: {
                                                connect: {
                                                    id: BigInt(brandId),
                                                },
                                            },
                                        })),
                                    }
                                  : undefined,
                              cost: value.costOfAssociation || undefined,
                          })),
                      }
                    : undefined),
            },
            dashapp_broadcast_partner_metrics: {
                deleteMany: {},
                ...(broadcastPartnerMetrics?.length
                    ? {
                          create: broadcastPartnerMetrics.map((metric) => ({
                              reach: metric.reach,
                              viewership: metric.viewership,
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
                              reach: metric.reach,
                              viewership: metric.viewership,
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
            instagram: instagram,
            facebook: facebook,
            linkedin: linkedin,
            twitter: twitter,
            youtube: youtube,
            website: website,
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TEAM, true);

    await prisma.dashapp_teamcontact.deleteMany();

    if (contactPerson?.length) {
        const contactData = contactPerson.map((details) => ({
            contact_name: details.contactName,
            contact_designation: details.contactDesignation,
            contact_email: details.contactEmail,
            contact_no: details.contactNumber,
            contact_linkedin: details.contactLinkedin,
            team_id: BigInt(teamId),
        }));

        await prisma.dashapp_teamcontact.createMany({
            data: contactData,
        });
    }

    res.status(STATUS_CODE.OK).json({
        message: "Team details updated",
    });
});

export const deleteTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.id;

    if (!teamId) {
        throw new BadRequestError("Team ID not found");
    }

    const teamExists = await prisma.dashapp_team.findUnique({
        where: { id: BigInt(teamId) },
        select: { id: true },
    });

    if (!teamExists?.id) {
        throw new NotFoundError("This team does not exists");
    }

    await prisma.dashapp_team.delete({
        where: { id: BigInt(teamId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.TEAM, true);

    res.status(STATUS_CODE.OK).json({
        message: "Team deleted",
    });
});

export const getFilteredTeam = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const {
        isMandatory,
        activeCampaignIds,
        ageIds,
        associationLevelIds,
        cityIds,
        contactDesignation,
        contactEmail,
        contactLinkedin,
        contactName,
        contactNumber,
        costOfAssociation,
        endorsement,
        facebook,
        franchiseFee,
        genderIds,
        ids,
        instagram,
        leagueIds,
        linkedin,
        nccsIds,
        ownerIds,
        partnerIdMetrics,
        primaryMarketIds,
        primaryMarketingPlatformIds,
        reachMetrics,
        secondaryMarketIds,
        secondaryMarketingPlatformIds,
        sportIds,
        stateIds,
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
    } = req.validatedData as TFilteredTeamSchema;

    const filterConditions: Prisma.dashapp_teamWhereInput = {
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

        dashapp_team_association:
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

        dashapp_teamendorsements:
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

        dashapp_team_age: ageIds?.length
            ? {
                  some: {
                      dashapp_age: {
                          id: { in: ageIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo: leagueIds?.length
            ? {
                  id: { in: leagueIds.map((id) => BigInt(id)) },
              }
            : undefined,

        dashapp_states: stateIds?.length
            ? {
                  id: { in: stateIds.map((id) => BigInt(id)) },
              }
            : undefined,

        dashapp_hqcity: cityIds?.length
            ? {
                  id: { in: cityIds.map((id) => BigInt(id)) },
              }
            : undefined,

        franchise_fee: franchiseFee ? new Prisma.Decimal(franchiseFee) : undefined,
        facebook: facebook ? { contains: facebook, mode: "insensitive" } : undefined,
        instagram: instagram ? { contains: instagram, mode: "insensitive" } : undefined,
        twitter: twitter ? { contains: twitter, mode: "insensitive" } : undefined,
        linkedin: linkedin ? { contains: linkedin, mode: "insensitive" } : undefined,
        youtube: youtube ? { contains: youtube, mode: "insensitive" } : undefined,
        website: website ? { contains: website, mode: "insensitive" } : undefined,

        dashapp_team_personality_traits: subPersonalityTraitIds?.length
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

        dashapp_team_gender: genderIds?.length
            ? {
                  every: {
                      dashapp_gender: await getGenderQuery(genderIds),
                  },
              }
            : undefined,

        dashapp_team_income: nccsIds?.length
            ? {
                  some: {
                      dashapp_nccs: {
                          id: { in: nccsIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_owner: ownerIds?.length
            ? {
                  some: {
                      dashapp_teamowner: {
                          id: { in: ownerIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_taglines: taglineIds?.length
            ? {
                  some: {
                      dashapp_taglines: {
                          id: { in: taglineIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_key_markets_primary: primaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: { in: primaryMarketIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_key_markets_secondary: secondaryMarketIds?.length
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

        dashapp_team_key_markets_tertiary: tertiaryIds?.length
            ? {
                  some: {
                      dashapp_states: {
                          id: { in: tertiaryIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_tier: tierIds?.length
            ? {
                  some: {
                      dashapp_tier: {
                          id: { in: tierIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_active_campaigns: activeCampaignIds?.length
            ? {
                  some: {
                      dashapp_activecampaigns: {
                          id: { in: activeCampaignIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_marketing_platforms_primary: primaryMarketingPlatformIds?.length
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

        dashapp_team_marketing_platforms_secondary: secondaryMarketingPlatformIds?.length
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

        dashapp_teamcontact:
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

    const teams = await getTeams({ query: combinedFilterConditions, take, skip, select: teamSelect });

    if (teams.length < 1) {
        throw new NotFoundError("No teams found for the given filters");
    }

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_team_personality_traits: {
                        some: { team_id: { in: teams.map((team) => team.id) } },
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            dashapp_subpersonality: {
                where: {
                    dashapp_team_personality_traits: {
                        some: {
                            team_id: { in: teams.map((team) => team.id) },
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    dashapp_team_personality_traits: {
                        select: {
                            team_id: true,
                        },
                    },
                },
            },
        },
    });

    const personalitiesByTeamId: Record<string, typeof mainPersonalities> = {};

    if (mainPersonalities.length > 0) {
        mainPersonalities.forEach((personality) => {
            if (personality.dashapp_subpersonality && Array.isArray(personality.dashapp_subpersonality)) {
                const teamIds = personality.dashapp_subpersonality
                    .flatMap((sub) => sub.dashapp_team_personality_traits.map((trait) => trait.team_id).filter(Boolean))
                    .filter(Boolean);
                if (teamIds.length > 0) {
                    teamIds.forEach((teamId) => {
                        const teamIdStr = teamId.toString();
                        if (!personalitiesByTeamId[teamIdStr]) {
                            personalitiesByTeamId[teamIdStr] = [];
                        }

                        const alreadyAdded = personalitiesByTeamId[teamIdStr].some((p) => p?.id === personality?.id);

                        if (!alreadyAdded) {
                            personalitiesByTeamId[teamIdStr].push(personality);
                        }
                    });
                }
            }
        });
    }

    const updatedTeams = teams.map((team) => ({
        ...team,
        mainPersonalities: personalitiesByTeamId[team?.id?.toString()] || [],
    }));

    let filteredTeams = updatedTeams;

    // 1. Exact filtering for dashapp_team_age
    if (ageIds?.length) {
        const requiredAgeIds = ageIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_age || !Array.isArray(team.dashapp_team_age)) return false;
            const teamAgeIds = team.dashapp_team_age
                .map((entry: any) => entry?.dashapp_age?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamAgeIds, requiredAgeIds);
        });
    }

    // 2. Exact filtering for dashapp_team_personality_traits
    if (subPersonalityTraitIds?.length) {
        const requiredSubPersonalityTraitIds = subPersonalityTraitIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.mainPersonalities || !Array.isArray(team.mainPersonalities)) return false;
            const teamSubPersonalityTraitIds = team.mainPersonalities
                .flatMap((entry: any) => {
                    if (!entry.dashapp_subpersonality || !Array.isArray(entry.dashapp_subpersonality)) return [];
                    return entry.dashapp_subpersonality
                        .map((sub: any) => {
                            return sub?.id?.toString();
                        })
                        .filter(Boolean);
                })
                .filter(Boolean);
            return exactSetMatch(teamSubPersonalityTraitIds, requiredSubPersonalityTraitIds);
        });
    }

    // 3. Exact filtering for dashapp_team_income
    if (nccsIds?.length) {
        const requiredNccsIds = nccsIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_income || !Array.isArray(team.dashapp_team_income)) return false;
            const teamNccsIds = team.dashapp_team_income
                .map((entry: any) => entry?.dashapp_nccs?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamNccsIds, requiredNccsIds);
        });
    }

    // 4. Exact filtering for dashapp_team_owner
    if (ownerIds?.length) {
        const requiredOwnerIds = ownerIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_owner || !Array.isArray(team.dashapp_team_owner)) return false;
            const teamOwnerIds = team.dashapp_team_owner
                .map((entry: any) => entry?.dashapp_teamowner?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamOwnerIds, requiredOwnerIds);
        });
    }

    // 5. Exact filtering for dashapp_team_taglines
    if (taglineIds?.length) {
        const requiredTaglineIds = taglineIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_taglines || !Array.isArray(team.dashapp_team_taglines)) return false;
            const teamTaglineIds = team.dashapp_team_taglines
                .map((entry: any) => entry?.dashapp_taglines?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamTaglineIds, requiredTaglineIds);
        });
    }

    // 6. Exact filtering for dashapp_team_key_markets_primary
    if (primaryMarketIds?.length) {
        const requiredKeyPrimaryIds = primaryMarketIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_key_markets_primary || !Array.isArray(team.dashapp_team_key_markets_primary))
                return false;
            const teamKeyPrimaryIds = team.dashapp_team_key_markets_primary
                .map((entry: any) => entry?.dashapp_keymarket?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamKeyPrimaryIds, requiredKeyPrimaryIds);
        });
    }

    // 7. Exact filtering for dashapp_team_key_markets_secondary
    if (secondaryMarketIds?.length) {
        const requiredKeySecondaryIds = secondaryMarketIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_key_markets_secondary || !Array.isArray(team.dashapp_team_key_markets_secondary))
                return false;
            const teamKeySecondaryIds = team.dashapp_team_key_markets_secondary
                .map((entry: any) => entry?.dashapp_keymarket?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamKeySecondaryIds, requiredKeySecondaryIds);
        });
    }

    // 8. Exact filtering for dashapp_team_key_markets_tertiary
    if (tertiaryIds?.length) {
        const requiredTertiaryIds = tertiaryIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_key_markets_tertiary || !Array.isArray(team.dashapp_team_key_markets_tertiary))
                return false;
            const teamTertiaryIds = team.dashapp_team_key_markets_tertiary
                .map((entry: any) => entry?.dashapp_states?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamTertiaryIds, requiredTertiaryIds);
        });
    }

    // 9. Exact filtering for dashapp_team_tier
    if (tierIds?.length) {
        const requiredTierIds = tierIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_tier || !Array.isArray(team.dashapp_team_tier)) return false;
            const teamTierIds = team.dashapp_team_tier
                .map((entry: any) => entry?.dashapp_tier?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamTierIds, requiredTierIds);
        });
    }

    // 10. Exact filtering for dashapp_team_active_campaigns
    if (activeCampaignIds?.length) {
        const requiredActiveCampaignIds = activeCampaignIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_active_campaigns || !Array.isArray(team.dashapp_team_active_campaigns)) return false;
            const teamActiveCampaignIds = team.dashapp_team_active_campaigns
                .map((entry: any) => entry?.dashapp_activecampaigns?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamActiveCampaignIds, requiredActiveCampaignIds);
        });
    }

    // 11. Exact filtering for dashapp_team_marketing_platforms_primary
    if (primaryMarketingPlatformIds?.length) {
        const requiredPrimaryIds = primaryMarketingPlatformIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (
                !team.dashapp_team_marketing_platforms_primary ||
                !Array.isArray(team.dashapp_team_marketing_platforms_primary)
            )
                return false;
            const teamPrimaryIds = team.dashapp_team_marketing_platforms_primary
                .map((entry: any) => entry?.dashapp_marketingplatform?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamPrimaryIds, requiredPrimaryIds);
        });
    }

    // 12. Exact filtering for dashapp_team_marketing_platforms_secondary
    if (secondaryMarketingPlatformIds?.length) {
        const requiredSecondaryIds = secondaryMarketingPlatformIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (
                !team.dashapp_team_marketing_platforms_secondary ||
                !Array.isArray(team.dashapp_team_marketing_platforms_secondary)
            )
                return false;
            const teamSecondaryIds = team.dashapp_team_marketing_platforms_secondary
                .map((entry: any) => entry?.dashapp_marketingplatform?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamSecondaryIds, requiredSecondaryIds);
        });
    }

    // 13. Exact filtering for dashapp_broadcast_partner_metrics
    if (partnerIdMetrics?.partnerIds?.length && partnerIdMetrics?.partnerType === "broadcast") {
        const requiredBroadcastPartnerIds = partnerIdMetrics?.partnerIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team?.dashapp_broadcast_partner_metrics || !Array.isArray(team?.dashapp_broadcast_partner_metrics))
                return false;
            const teamBroadcastPartnerIds = team.dashapp_broadcast_partner_metrics
                .map((entry: any) => entry?.dashapp_broadcastpartner?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamBroadcastPartnerIds, requiredBroadcastPartnerIds);
        });
    }

    // 14. Exact filtering for dashapp_ott_partner_metrics
    if (partnerIdMetrics?.partnerIds?.length && partnerIdMetrics?.partnerType === "ott") {
        const requiredOttPartnerIds = partnerIdMetrics?.partnerIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team?.dashapp_ott_partner_metrics || !Array.isArray(team?.dashapp_ott_partner_metrics)) return false;
            const teamOttPartnerIds = team.dashapp_ott_partner_metrics
                .map((entry: any) => entry?.dashapp_ottpartner?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamOttPartnerIds, requiredOttPartnerIds);
        });
    }

    const modifiedTeams =
        genderIds?.length === 2
            ? filteredTeams.filter((team) => team?.dashapp_team_gender?.length === 2)
            : filteredTeams;

    const teamResponse: TeamResponseDTO[] = modifiedTeams.map((team) =>
        TeamResponseDTO.toResponse(team as unknown as TTeamDetails),
    );

    res.status(STATUS_CODE.OK).json(teamResponse);
});
