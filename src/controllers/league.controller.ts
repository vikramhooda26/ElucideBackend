import { Prisma } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { LeagueResponseDTO } from "../dto/league.dto.js";
import { METADATA_KEYS, STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { areElementsDistinct } from "../lib/helpers.js";
import { metadataStore } from "../managers/MetadataManager.js";
import { TCreateLeagueSchema, TEditLeagueSchema, TFilteredLeagueSchema } from "../schemas/league.schema.js";
import { leagueSelect, TLeagueDetails } from "../types/league.type.js";
import {
  exactSetMatch,
  getCostQuery,
  getEndorsementQuery,
  getGenderQuery,
  getMetricsQuery,
} from "./constants/index.js";
import { getLeaguesCount } from "./dashboard/helpers.js";

export const getLeagues = async ({
  query,
  take,
  skip,
  select,
  orderBy = "modified_date",
  orderDirection = "desc",
}: {
  query?: Prisma.dashapp_leagueinfoWhereInput;
  take?: any;
  skip?: any;
  select: Prisma.dashapp_leagueinfoSelect;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}) => {
  let orderByObject: any = {};

  if (orderBy === "created_by" || orderBy === "modified_by") {
    orderByObject = {
      [orderBy]: {
        email: orderDirection,
      },
    };
  } else {
    orderByObject = {
      [orderBy]: orderDirection,
    };
  }
  return await prisma.dashapp_leagueinfo.findMany({
    where: query || undefined,
    select: select,
    orderBy: orderByObject,
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
  const { take, skip, orderBy, orderDirection, search } = req.query;

  const fieldMapping: Record<string, string> = {
    name: "property_name",
    createdDate: "created_date",
    modifiedDate: "modified_date",
    createdBy: "created_by",
    modifiedBy: "modified_by",
  };

  const query: Prisma.dashapp_leagueinfoWhereInput = {};

  if (search && typeof search === "string" && search.trim() !== "") {
    query.property_name = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  const dbOrderByField = orderBy ? fieldMapping[orderBy as string] || "modified_date" : "modified_date";
  const dbOrderDirection = (orderDirection as "asc" | "desc") || "desc";

  const [leagues, totalCount] = await Promise.all([
    getLeagues({
      query,
      take,
      skip,
      select: leagueSelect,
      orderBy: dbOrderByField,
      orderDirection: dbOrderDirection,
    }),
    getLeaguesCount(search ? query : undefined),
  ]);

  const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
    where: {
      dashapp_subpersonality: {
        some: {
          dashapp_leagueinfo_personality_traits: {
            some: { leagueinfo_id: { in: leagues.map((league) => league.id) } },
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
              leagueinfo_id: { in: leagues.map((league) => league.id) },
            },
          },
        },
        select: {
          id: true,
          name: true,
          dashapp_leagueinfo_personality_traits: {
            select: {
              leagueinfo_id: true,
            },
          },
        },
      },
    },
  });

  const personalitiesByLeagueId: Record<string, typeof mainPersonalities> = {};

  mainPersonalities.forEach((personality) => {
    personality.dashapp_subpersonality.forEach((subPersonality) => {
      const leagueIds = subPersonality.dashapp_leagueinfo_personality_traits.map((trait) => trait.leagueinfo_id);

      leagueIds.forEach((leagueId) => {
        const leagueIdStr = leagueId.toString();

        if (!personalitiesByLeagueId[leagueIdStr]) {
          personalitiesByLeagueId[leagueIdStr] = [];
        }

        const alreadyAdded = personalitiesByLeagueId[leagueIdStr].some((p) => p.id === personality.id);

        if (!alreadyAdded) {
          const filteredPersonality = {
            ...personality,
            dashapp_subpersonality: personality.dashapp_subpersonality.filter((sub) =>
              sub.dashapp_leagueinfo_personality_traits.some((trait) => trait.leagueinfo_id.toString() === leagueIdStr),
            ),
          };

          personalitiesByLeagueId[leagueIdStr].push(filteredPersonality);
        }
      });
    });
  });

  const updatedLeagues = leagues.map((league) => ({
    ...league,
    mainPersonalities: personalitiesByLeagueId[league.id.toString()] || [],
  }));

  const leagueResponse: LeagueResponseDTO[] = updatedLeagues.map((league) =>
    LeagueResponseDTO.toResponse(league as unknown as TLeagueDetails),
  );

  res.status(STATUS_CODE.OK).json({ items: leagueResponse, totalCount });
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

  await prisma.dashapp_leaguecontact.deleteMany({
    where: {
      league_id: BigInt(leagueId),
    },
  });

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

  const validatedData = req.validatedData as TFilteredLeagueSchema;

  const activeCampaignIds = validatedData.activeCampaignIds?.value;
  const ageIds = validatedData.ageIds?.value;
  const associationLevelIds = validatedData.associationLevelIds?.value;
  const broadcastPartnerIds = validatedData.broadcastPartnerIds?.value;
  const contactDesignation = validatedData.contactDesignation?.value;
  const contactEmail = validatedData.contactEmail?.value;
  const contactLinkedin = validatedData.contactLinkedin?.value;
  const contactName = validatedData.contactName?.value;
  const contactNumber = validatedData.contactNumber?.value;
  const costOfAssociation = validatedData.costOfAssociation?.value;
  const facebook = validatedData.facebook?.value;
  const formatIds = validatedData.formatIds?.value;
  const genderIds = validatedData.genderIds?.value;
  const ids = validatedData.ids?.value;
  const instagram = validatedData.instagram?.value;
  const endorsement = validatedData.endorsement?.value;
  const linkedin = validatedData.linkedin?.value;
  const nccsIds = validatedData.nccsIds?.value;
  const ottPartnerIds = validatedData.ottPartnerIds?.value;
  const ownerIds = validatedData.ownerIds?.value;
  const partnerIdMetrics = validatedData.partnerIdMetrics?.value;
  const primaryMarketIds = validatedData.primaryMarketIds?.value;
  const primaryMarketingPlatformIds = validatedData.primaryMarketingPlatformIds?.value;
  const reachMetrics = validatedData.reachMetrics?.value;
  const secondaryMarketIds = validatedData.secondaryMarketIds?.value;
  const secondaryMarketingPlatformIds = validatedData.secondaryMarketingPlatformIds?.value;
  const sportIds = validatedData.sportIds?.value;
  const strategyOverview = validatedData.strategyOverview?.value;
  const subPersonalityTraitIds = validatedData.subPersonalityTraitIds?.value;
  const taglineIds = validatedData.taglineIds?.value;
  const tertiaryIds = validatedData.tertiaryIds?.value;
  const tierIds = validatedData.tierIds?.value;
  const twitter = validatedData.twitter?.value;
  const viewershipMetrics = validatedData.viewershipMetrics?.value;
  const website = validatedData.website?.value;
  const yearMetrics = validatedData.yearMetrics?.value;
  const yearOfInception = validatedData.yearOfInception?.value;
  const youtube = validatedData.youtube?.value;

  const filterConditions: Prisma.dashapp_leagueinfoWhereInput = {
    id: ids?.length ? { in: ids.map((id) => BigInt(id)) } : undefined,

    ...(reachMetrics?.partnerType === "broadcast" ||
    viewershipMetrics?.partnerType === "broadcast" ||
    yearMetrics?.partnerType === "broadcast" ||
    partnerIdMetrics?.partnerType === "broadcast"
      ? {
          dashapp_broadcast_partner_metrics: {
            some: getMetricsQuery("broadcast", reachMetrics, viewershipMetrics, yearMetrics, partnerIdMetrics),
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

    dashapp_broadcastpartner: broadcastPartnerIds?.length
      ? {
          id: { in: broadcastPartnerIds.map((id) => BigInt(id)) },
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
          //   none: {
          //       dashapp_age: {
          //           id: { notIn: ageIds.map((id) => BigInt(id)) },
          //       },
          //   },
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
          //   none: {
          //       dashapp_subpersonality: {
          //           id: {
          //               notIn: subPersonalityTraitIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
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
          //   none: {
          //       dashapp_nccs: {
          //           id: { notIn: nccsIds.map((id) => BigInt(id)) },
          //       },
          //   },
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
          //   none: {
          //       dashapp_leagueowner: {
          //           id: { notIn: ownerIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_leagueinfo_taglines: taglineIds?.length
      ? {
          some: {
            dashapp_taglines: {
              id: { in: taglineIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_taglines: {
          //           id: { notIn: taglineIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_leagueinfo_key_markets_primary: primaryMarketIds?.length
      ? {
          some: {
            dashapp_keymarket: {
              id: { in: primaryMarketIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_keymarket: {
          //           id: { notIn: primaryMarketIds.map((id) => BigInt(id)) },
          //       },
          //   },
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
          //   none: {
          //       dashapp_keymarket: {
          //           id: {
          //               notIn: secondaryMarketIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
        }
      : undefined,

    dashapp_leagueinfo_key_markets_tertiary: tertiaryIds?.length
      ? {
          some: {
            dashapp_states: {
              id: { in: tertiaryIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_states: {
          //           id: { notIn: tertiaryIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_leagueinfo_tier: tierIds?.length
      ? {
          some: {
            dashapp_tier: {
              id: { in: tierIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_tier: {
          //           id: { notIn: tierIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_leagueinfo_active_campaigns: activeCampaignIds?.length
      ? {
          some: {
            dashapp_activecampaigns: {
              id: { in: activeCampaignIds.map((id) => BigInt(id)) },
            },
          },
          none: {
            dashapp_activecampaigns: {
              id: { notIn: activeCampaignIds.map((id) => BigInt(id)) },
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
          //   none: {
          //       dashapp_marketingplatform: {
          //           id: {
          //               notIn: primaryMarketingPlatformIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
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
          //   none: {
          //       dashapp_marketingplatform: {
          //           id: {
          //               notIn: secondaryMarketingPlatformIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
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

  const combinedFilterConditions = {
    OR: Object.entries(filterConditions)
      .filter(([_, condition]) => condition)
      .map(([key, condition]) => ({ [key]: condition })),
  };

  const leagues = await getLeagues({ query: combinedFilterConditions, take, skip, select: leagueSelect });

  if (leagues.length < 1) {
    res.status(200).json([]);
  }

  const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
    where: {
      dashapp_subpersonality: {
        some: {
          dashapp_leagueinfo_personality_traits: {
            some: { leagueinfo_id: { in: leagues.map((league) => league.id) } },
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
              leagueinfo_id: { in: leagues.map((league) => league.id) },
            },
          },
        },
        select: {
          id: true,
          name: true,
          dashapp_leagueinfo_personality_traits: {
            select: {
              leagueinfo_id: true,
            },
          },
        },
      },
    },
  });

  const personalitiesByLeagueId: Record<string, typeof mainPersonalities> = {};

  mainPersonalities.forEach((personality) => {
    personality.dashapp_subpersonality.forEach((subPersonality) => {
      const leagueIds = subPersonality.dashapp_leagueinfo_personality_traits.map((trait) => trait.leagueinfo_id);

      leagueIds.forEach((leagueId) => {
        const leagueIdStr = leagueId.toString();

        if (!personalitiesByLeagueId[leagueIdStr]) {
          personalitiesByLeagueId[leagueIdStr] = [];
        }

        const alreadyAdded = personalitiesByLeagueId[leagueIdStr].some((p) => p.id === personality.id);

        if (!alreadyAdded) {
          const filteredPersonality = {
            ...personality,
            dashapp_subpersonality: personality.dashapp_subpersonality.filter((sub) =>
              sub.dashapp_leagueinfo_personality_traits.some((trait) => trait.leagueinfo_id.toString() === leagueIdStr),
            ),
          };

          personalitiesByLeagueId[leagueIdStr].push(filteredPersonality);
        }
      });
    });
  });

  const updatedLeagues = leagues.map((league) => ({
    ...league,
    mainPersonalities: personalitiesByLeagueId[league.id.toString()] || [],
  }));

  let filteredLeagues = updatedLeagues;

  // 1. Exact filtering for dashapp_leagueinfo_age
  if (ageIds?.length && validatedData.ageIds?.isMandatory) {
    const requiredAgeIds = ageIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueAgeIds = league.dashapp_leagueinfo_age
        .map((entry: any) => entry.dashapp_age?.id?.toString())
        .filter(Boolean);
      return exactSetMatch(leagueAgeIds, requiredAgeIds);
    });
  }

  // 2. Exact filtering for dashapp_leagueinfo_personality_traits
  if (subPersonalityTraitIds?.length && validatedData.subPersonalityTraitIds?.isMandatory) {
    const requiredSubPersonalityTraitIds = subPersonalityTraitIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueSubPersonalityTraitIds = league.mainPersonalities.flatMap((entry: any) =>
        entry.dashapp_subpersonality?.map((sub: any) => sub.id.toString()),
      );
      return exactSetMatch(leagueSubPersonalityTraitIds, requiredSubPersonalityTraitIds);
    });
  }

  // 3. Exact filtering for dashapp_leagueinfo_income
  if (nccsIds?.length && validatedData.nccsIds?.isMandatory) {
    const requiredNccsIds = nccsIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueNccsIds = league.dashapp_leagueinfo_income.map((entry: any) => entry.dashapp_nccs.id.toString());
      return exactSetMatch(leagueNccsIds, requiredNccsIds);
    });
  }

  // 4. Exact filtering for dashapp_leagueinfo_owner
  if (ownerIds?.length && validatedData.ownerIds?.isMandatory) {
    const requiredOwnerIds = ownerIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueOwnerIds = league.dashapp_leagueinfo_owner.map((entry: any) =>
        entry.dashapp_leagueowner.id.toString(),
      );
      return exactSetMatch(leagueOwnerIds, requiredOwnerIds);
    });
  }

  // 5. Exact filtering for dashapp_leagueinfo_taglines
  if (taglineIds?.length && validatedData.taglineIds?.isMandatory) {
    const requiredTaglineIds = taglineIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueTaglineIds = league.dashapp_leagueinfo_taglines.map((entry: any) =>
        entry.dashapp_taglines.id.toString(),
      );
      return exactSetMatch(leagueTaglineIds, requiredTaglineIds);
    });
  }

  // 6. Exact filtering for dashapp_leagueinfo_key_markets_primary
  if (primaryMarketIds?.length && validatedData.primaryMarketIds?.isMandatory) {
    const requiredPrimaryIds = primaryMarketIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leaguePrimaryIds = league.dashapp_leagueinfo_key_markets_primary.map((entry: any) =>
        entry.dashapp_keymarket.id.toString(),
      );
      return exactSetMatch(leaguePrimaryIds, requiredPrimaryIds);
    });
  }

  // 7. Exact filtering for dashapp_leagueinfo_key_markets_secondary
  if (secondaryMarketIds?.length && validatedData.secondaryMarketIds?.isMandatory) {
    const requiredSecondaryIds = secondaryMarketIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueSecondaryIds = league.dashapp_leagueinfo_key_markets_secondary.map((entry: any) =>
        entry.dashapp_keymarket.id.toString(),
      );
      return exactSetMatch(leagueSecondaryIds, requiredSecondaryIds);
    });
  }

  // 8. Exact filtering for dashapp_leagueinfo_key_markets_tertiary
  if (tertiaryIds?.length && validatedData.tertiaryIds?.isMandatory) {
    const requiredTertiaryIds = tertiaryIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueTertiaryIds = league.dashapp_leagueinfo_key_markets_tertiary.map((entry: any) =>
        entry.dashapp_states.id.toString(),
      );
      return exactSetMatch(leagueTertiaryIds, requiredTertiaryIds);
    });
  }

  // 9. Exact filtering for dashapp_leagueinfo_tier
  if (tierIds?.length && validatedData.tierIds?.isMandatory) {
    const requiredTierIds = tierIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueTierIds = league.dashapp_leagueinfo_tier
        .map((entry: any) => entry.dashapp_tier?.id?.toString())
        .filter(Boolean);
      return exactSetMatch(leagueTierIds, requiredTierIds);
    });
  }

  // 10. Exact filtering for dashapp_leagueinfo_marketing_platforms_primary
  if (primaryMarketingPlatformIds?.length && validatedData.primaryMarketingPlatformIds?.isMandatory) {
    const requiredPrimaryIds = primaryMarketingPlatformIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leaguePrimaryIds = league.dashapp_leagueinfo_marketing_platforms_primary.map((entry: any) =>
        entry.dashapp_marketingplatform.id.toString(),
      );
      return exactSetMatch(leaguePrimaryIds, requiredPrimaryIds);
    });
  }

  // 11. Exact filtering for dashapp_leagueinfo_marketing_platforms_secondary
  if (secondaryMarketingPlatformIds?.length && validatedData.secondaryMarketingPlatformIds?.isMandatory) {
    const requiredSecondaryIds = secondaryMarketingPlatformIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueSecondaryIds = league.dashapp_leagueinfo_marketing_platforms_secondary.map((entry: any) =>
        entry.dashapp_marketingplatform.id.toString(),
      );
      return exactSetMatch(leagueSecondaryIds, requiredSecondaryIds);
    });
  }

  // 12. Exact filtering for dashapp_broadcast_partner_metrics
  if (
    partnerIdMetrics?.partnerIds?.length &&
    partnerIdMetrics?.partnerType === "broadcast" &&
    validatedData.partnerIdMetrics?.isMandatory
  ) {
    const requiredBroadcastPartnerIds = partnerIdMetrics?.partnerIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueBroadcastPartnerIds = league?.dashapp_broadcast_partner_metrics?.map((entry: any) =>
        entry?.dashapp_broadcastpartner?.id?.toString(),
      );
      return exactSetMatch(leagueBroadcastPartnerIds, requiredBroadcastPartnerIds);
    });
  }

  // 13. Exact filtering for dashapp_ott_partner_metrics
  if (
    partnerIdMetrics?.partnerIds?.length &&
    partnerIdMetrics?.partnerType === "ott" &&
    validatedData.partnerIdMetrics?.isMandatory
  ) {
    const requiredOttPartnerIds = partnerIdMetrics?.partnerIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueOttPartnerIds = league?.dashapp_ott_partner_metrics?.map((entry: any) =>
        entry?.dashapp_ottpartner?.id?.toString(),
      );
      return exactSetMatch(leagueOttPartnerIds, requiredOttPartnerIds);
    });
  }

  if (genderIds?.length && validatedData.genderIds?.isMandatory) {
    const requiredGenderIds = genderIds.map((id) => BigInt(id).toString());
    filteredLeagues = filteredLeagues.filter((league) => {
      const leagueGenderIds = league?.dashapp_leagueinfo_gender?.map((entry: any) => {
        return entry?.dashapp_gender?.id?.toString();
      });
      return exactSetMatch(leagueGenderIds, requiredGenderIds);
    });
  }

  const leagueResponse: LeagueResponseDTO[] = filteredLeagues.map((league) =>
    LeagueResponseDTO.toResponse(league as unknown as TLeagueDetails),
  );

  res.status(STATUS_CODE.OK).json(leagueResponse);
});
