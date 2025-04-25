import { Prisma } from "@prisma/client";
import { differenceInYears, format, parseISO } from "date-fns";
import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { AthleteResponseDTO } from "../dto/athlete.dto.js";
import { METADATA_KEYS, STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { areElementsDistinct } from "../lib/helpers.js";
import { metadataStore } from "../managers/MetadataManager.js";
import { TCreateAthleteSchema, TEditAthleteSchema, TFilteredAthleteSchema } from "../schemas/athlete.schema.js";
import { athleteSelect, TAthleteDetails } from "../types/athlete.type.js";
import { exactSetMatch, getCostQuery, getGenderQuery } from "./constants/index.js";
import { getAthletesCount } from "./dashboard/helpers.js";

const findAgeRange = async (dob: string): Promise<string | undefined> => {
  const dobDate = parseISO(dob);

  const age = differenceInYears(new Date(), dobDate);

  const ageRanges = await prisma.dashapp_age.findMany({
    select: { age_range: true },
  });

  if (!ageRanges) {
    return undefined;
  }

  let matchedAgeRange: string | undefined;

  ageRanges.find((range) => {
    const [minAge, maxAge] = range.age_range.split(/[-+]/).map(Number);
    if ((minAge && maxAge && age >= minAge && age <= maxAge) || ((!maxAge || maxAge === 0) && age >= minAge)) {
      matchedAgeRange = range.age_range;
      return true;
    } else {
      return false;
    }
  });

  return matchedAgeRange;
};

const formatDob = (date: Date) => {
  return format(date, "yyyy-MM-dd").toString();
};

export const getAthletes = async ({
  query,
  take,
  skip,
  select,
  orderBy = "modified_date",
  orderDirection = "desc",
}: {
  take?: any;
  skip?: any;
  query?: Prisma.dashapp_athleteWhereInput;
  select: Prisma.dashapp_athleteSelect;
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
  return await prisma.dashapp_athlete.findMany({
    where: query,
    select: select,
    orderBy: orderByObject,
    take: Number.isNaN(Number(take)) ? undefined : Number(take),
    skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
  });
};

export const getAllAthletes = asyncHandler(async (req, res) => {
  const { take, skip, orderBy, orderDirection, search } = req.query;

  const fieldMapping: Record<string, string> = {
    name: "athlete_name",
    createdDate: "created_date",
    modifiedDate: "modified_date",
    createdBy: "created_by",
    modifiedBy: "modified_by",
  };

  const dbOrderByField = orderBy ? fieldMapping[orderBy as string] || "modified_date" : "modified_date";
  const dbOrderDirection = (orderDirection as "asc" | "desc") || "desc";

  const query: Prisma.dashapp_athleteWhereInput = {};

  if (search && typeof search === "string" && search.trim() !== "") {
    query.athlete_name = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  const [athletes, totalCount] = await Promise.all([
    getAthletes({
      query,
      take,
      skip,
      select: athleteSelect,
      orderBy: dbOrderByField,
      orderDirection: dbOrderDirection,
    }),
    getAthletesCount(search ? query : undefined),
  ]);

  const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
    where: {
      dashapp_subpersonality: {
        some: {
          dashapp_athlete_personality_traits: {
            some: { athlete_id: { in: athletes.map((athlete) => athlete.id) } },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      dashapp_subpersonality: {
        where: {
          dashapp_athlete_personality_traits: {
            some: { athlete_id: { in: athletes.map((athlete) => athlete.id) } },
          },
        },
        select: {
          id: true,
          name: true,
          dashapp_athlete_personality_traits: {
            select: {
              athlete_id: true,
            },
          },
        },
      },
    },
  });

  const personalitiesByAthleteId: Record<string, typeof mainPersonalities> = {};

  mainPersonalities.forEach((personality) => {
    personality.dashapp_subpersonality.forEach((subPersonality) => {
      const athleteIds = subPersonality.dashapp_athlete_personality_traits.map((trait) => trait.athlete_id);

      athleteIds.forEach((athleteId) => {
        const athleteIdStr = athleteId.toString();

        if (!personalitiesByAthleteId[athleteIdStr]) {
          personalitiesByAthleteId[athleteIdStr] = [];
        }

        const alreadyAdded = personalitiesByAthleteId[athleteIdStr].some((p) => p.id === personality.id);

        if (!alreadyAdded) {
          const filteredPersonality = {
            ...personality,
            dashapp_subpersonality: personality.dashapp_subpersonality.filter((sub) =>
              sub.dashapp_athlete_personality_traits.some((trait) => trait.athlete_id.toString() === athleteIdStr),
            ),
          };

          personalitiesByAthleteId[athleteIdStr].push(filteredPersonality);
        }
      });
    });
  });

  const updatedAthletes = athletes.map((athlete) => ({
    ...athlete,
    mainPersonalities: personalitiesByAthleteId[athlete.id.toString()] || [],
  }));

  const athleteResponse: AthleteResponseDTO[] = updatedAthletes.map((athlete) =>
    AthleteResponseDTO.toResponse(athlete as unknown as TAthleteDetails),
  );

  res.status(200).json({ items: athleteResponse, totalCount });
});

export const getAthleteById = asyncHandler(async (req, res) => {
  const athleteId = req.params.id;

  if (!athleteId) {
    throw new BadRequestError("Athlete ID not found");
  }

  const athlete = await prisma.dashapp_athlete.findUnique({
    where: { id: BigInt(athleteId) },
    select: athleteSelect,
  });

  if (!athlete?.id) {
    throw new NotFoundError("This athlete does not exists");
  }

  const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
    where: {
      dashapp_subpersonality: {
        some: {
          dashapp_athlete_personality_traits: {
            some: { athlete_id: BigInt(athleteId) },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      dashapp_subpersonality: {
        where: {
          dashapp_athlete_personality_traits: {
            some: { athlete_id: BigInt(athleteId) },
          },
        },
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const updatedAthlete = {
    ...athlete,
    mainPersonalities,
  };

  const athleteResponse: AthleteResponseDTO = AthleteResponseDTO.toResponse(updatedAthlete);

  res.status(STATUS_CODE.OK).json(athleteResponse);
});

export const createAthlete = asyncHandler(async (req, res) => {
  const {
    name,
    athleteAge,
    ageIds,
    athleteGenderId,
    genderIds,
    nccsIds,
    userId,
    facebook,
    instagram,
    twitter,
    linkedin,
    website,
    youtube,
    agencyId,
    sportId,
    nationalityId,
    subPersonalityTraitIds,
    primaryMarketIds,
    secondaryMarketIds,
    tertiaryIds,
    primarySocialMediaPlatformIds,
    secondarySocialMediaPlatformIds,
    association,
    statusId,
    stateId,
    contactPerson,
    tierIds,
    strategyOverview,
  } = req.validatedData as TCreateAthleteSchema;

  if (association?.length) {
    const isDistinct = areElementsDistinct(association?.map((association) => association.associationLevelId));

    if (!isDistinct) {
      throw new BadRequestError("Association Level must be unique");
    }
  }

  const athlete = await prisma.dashapp_athlete.create({
    data: {
      athlete_name: name,
      created_by: { connect: { id: BigInt(userId) } },
      modified_by: { connect: { id: BigInt(userId) } },
      facebook: facebook,
      instagram: instagram,
      twitter: twitter,
      linkedin: linkedin,
      youtube: youtube,
      website: website,
      dashapp_athlete_tier: tierIds?.length
        ? {
            create: tierIds.map((tierId) => ({
              dashapp_tier: { connect: { id: BigInt(tierId) } },
            })),
          }
        : undefined,
      dashapp_agency: agencyId
        ? {
            connect: { id: BigInt(agencyId) },
          }
        : undefined,
      dashapp_states: stateId
        ? {
            connect: { id: BigInt(stateId) },
          }
        : undefined,
      dashapp_athlete_status: statusId
        ? {
            connect: { id: BigInt(statusId) },
          }
        : undefined,
      dashapp_athlete_association: association?.length
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
      dashapp_athlete_socialmedia_platform_primary: primarySocialMediaPlatformIds?.length
        ? {
            create: primarySocialMediaPlatformIds.map((platformId) => ({
              dashapp_socialmedia_platform: {
                connect: { id: BigInt(platformId) },
              },
            })),
          }
        : undefined,
      dashapp_athlete_socialmedia_platform_secondary: secondarySocialMediaPlatformIds?.length
        ? {
            create: secondarySocialMediaPlatformIds.map((platformId) => ({
              dashapp_socialmedia_platform: {
                connect: { id: BigInt(platformId) },
              },
            })),
          }
        : undefined,
      dashapp_sport: sportId
        ? {
            connect: { id: BigInt(sportId) },
          }
        : undefined,
      nationality: nationalityId ? { connect: { id: BigInt(nationalityId) } } : undefined,
      dashapp_athlete_personality_traits: subPersonalityTraitIds?.length
        ? {
            create: subPersonalityTraitIds.map((traitId) => ({
              dashapp_subpersonality: {
                connect: { id: BigInt(traitId) },
              },
            })),
          }
        : undefined,
      age: athleteAge,
      dashapp_athlete_target_age: ageIds?.length
        ? {
            create: ageIds.map((ageId) => ({
              dashapp_age: {
                connect: { id: BigInt(ageId) },
              },
            })),
          }
        : undefined,
      dashapp_athlete_target_gender: genderIds?.length
        ? {
            create: genderIds.map((genderId) => ({
              dashapp_gender: { connect: { id: BigInt(genderId) } },
            })),
          }
        : undefined,
      dashapp_gender: athleteGenderId
        ? {
            connect: { id: BigInt(athleteGenderId) },
          }
        : undefined,
      strategy_overview: strategyOverview,
      dashapp_athlete_target_income: nccsIds?.length
        ? {
            create: nccsIds.map((nccsId) => ({
              dashapp_nccs: { connect: { id: BigInt(nccsId) } },
            })),
          }
        : undefined,
      dashapp_athlete_key_markets_primary: primaryMarketIds?.length
        ? {
            create: primaryMarketIds?.map((marketId) => ({
              dashapp_keymarket: {
                connect: { id: BigInt(marketId) },
              },
            })),
          }
        : undefined,
      dashapp_athlete_key_markets_secondary: secondaryMarketIds?.length
        ? {
            create: secondaryMarketIds?.map((marketId) => ({
              dashapp_keymarket: {
                connect: { id: BigInt(marketId) },
              },
            })),
          }
        : undefined,
      dashapp_athlete_key_markets_tertiary: tertiaryIds?.length
        ? {
            create: tertiaryIds?.map((tertiaryId) => ({
              dashapp_states: {
                connect: { id: BigInt(tertiaryId) },
              },
            })),
          }
        : undefined,
    },
    select: {
      id: true,
    },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.ATHLETE, true);

  if (contactPerson?.length) {
    await prisma.dashapp_athletecontact.createMany({
      data: contactPerson.map((details) => ({
        contact_name: details.contactName,
        contact_designation: details.contactDesignation,
        contact_email: details.contactEmail,
        contact_no: details.contactNumber,
        contact_linkedin: details.contactLinkedin,
        athlete_id: athlete.id,
      })),
    });
  }

  res.status(STATUS_CODE.OK).json({
    message: "Athlete created",
  });
});

export const editAthlete = asyncHandler(async (req, res) => {
  const athleteId = req.params.id;

  if (!athleteId) {
    throw new BadRequestError("Athlete ID not found");
  }

  const athleteExists = await prisma.dashapp_athlete.findUnique({
    where: { id: BigInt(athleteId) },
    select: { id: true },
  });

  if (!athleteExists?.id) {
    throw new NotFoundError("This athlete does not exists");
  }

  const {
    name,
    athleteAge,
    genderIds,
    nccsIds,
    userId,
    facebook,
    instagram,
    twitter,
    linkedin,
    website,
    youtube,
    agencyId,
    sportId,
    nationalityId,
    subPersonalityTraitIds,
    primaryMarketIds,
    secondaryMarketIds,
    tertiaryIds,
    association,
    primarySocialMediaPlatformIds,
    secondarySocialMediaPlatformIds,
    statusId,
    stateId,
    tierIds,
    contactPerson,
    ageIds,
    athleteGenderId,
    strategyOverview,
  } = req.validatedData as TEditAthleteSchema;

  if (association?.length) {
    const isDistinct = areElementsDistinct(association?.map((association) => association.associationLevelId));

    if (!isDistinct) {
      throw new BadRequestError("Association Level must be unique");
    }
  }

  await prisma.dashapp_athlete.update({
    where: { id: BigInt(athleteId) },
    data: {
      athlete_name: name,
      age: athleteAge,
      dashapp_athlete_association: {
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
      strategy_overview: strategyOverview,
      modified_by: userId ? { connect: { id: BigInt(userId) } } : { disconnect: true },
      dashapp_states: stateId
        ? {
            connect: { id: BigInt(stateId) },
          }
        : { disconnect: true },
      dashapp_athlete_tier: {
        deleteMany: {},
        ...(tierIds?.length
          ? {
              create: tierIds.map((tierId) => ({
                dashapp_tier: { connect: { id: BigInt(tierId) } },
              })),
            }
          : undefined),
      },
      facebook: facebook,
      instagram: instagram,
      twitter: twitter,
      linkedin: linkedin,
      youtube: youtube,
      website: website,
      dashapp_athlete_status: statusId
        ? {
            connect: { id: BigInt(statusId) },
          }
        : undefined,
      dashapp_athlete_socialmedia_platform_primary: {
        deleteMany: {},
        ...(primarySocialMediaPlatformIds?.length
          ? {
              create: primarySocialMediaPlatformIds.map((primarySocialMediaId) => ({
                dashapp_socialmedia_platform: {
                  connect: {
                    id: BigInt(primarySocialMediaId),
                  },
                },
              })),
            }
          : undefined),
      },
      dashapp_athlete_socialmedia_platform_secondary: {
        deleteMany: {},
        ...(secondarySocialMediaPlatformIds?.length
          ? {
              create: secondarySocialMediaPlatformIds.map((secondarySocialMediaId) => ({
                dashapp_socialmedia_platform: {
                  connect: {
                    id: BigInt(secondarySocialMediaId),
                  },
                },
              })),
            }
          : undefined),
      },
      dashapp_agency: agencyId ? { connect: { id: BigInt(agencyId) } } : { disconnect: true },
      dashapp_sport: sportId ? { connect: { id: BigInt(sportId) } } : { disconnect: true },
      nationality: nationalityId ? { connect: { id: BigInt(nationalityId) } } : { disconnect: true },
      dashapp_athlete_personality_traits: subPersonalityTraitIds
        ? {
            deleteMany: {},
            create: subPersonalityTraitIds?.map((traitId) => ({
              dashapp_subpersonality: {
                connect: { id: BigInt(traitId) },
              },
            })),
          }
        : undefined,
      dashapp_athlete_target_age: {
        deleteMany: {},
        ...(ageIds?.length
          ? {
              create: ageIds.map((ageId) => ({
                dashapp_age: { connect: { id: BigInt(ageId) } },
              })),
            }
          : undefined),
      },
      dashapp_gender: athleteGenderId?.length
        ? {
            connect: {
              id: BigInt(athleteGenderId),
            },
          }
        : { disconnect: true },
      dashapp_athlete_target_gender: {
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
      dashapp_athlete_target_income: {
        deleteMany: {},
        ...(nccsIds?.length
          ? {
              create: nccsIds.map((nccsId) => ({
                dashapp_nccs: { connect: { id: BigInt(nccsId) } },
              })),
            }
          : undefined),
      },
      dashapp_athlete_key_markets_primary: {
        deleteMany: {},
        ...(primaryMarketIds?.length
          ? {
              create: primaryMarketIds?.map((marketId) => ({
                dashapp_keymarket: {
                  connect: { id: BigInt(marketId) },
                },
              })),
            }
          : undefined),
      },
      dashapp_athlete_key_markets_secondary: {
        deleteMany: {},
        ...(secondaryMarketIds?.length
          ? {
              create: secondaryMarketIds?.map((marketId) => ({
                dashapp_keymarket: {
                  connect: { id: BigInt(marketId) },
                },
              })),
            }
          : undefined),
      },
      dashapp_athlete_key_markets_tertiary: {
        deleteMany: {},
        ...(tertiaryIds?.length
          ? {
              create: tertiaryIds?.map((tertiaryId) => ({
                dashapp_states: {
                  connect: { id: BigInt(tertiaryId) },
                },
              })),
            }
          : undefined),
      },
    },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.ATHLETE, true);

  await prisma.dashapp_athletecontact.deleteMany({
    where: {
      athlete_id: BigInt(athleteId),
    },
  });

  if (contactPerson?.length) {
    const contactData = contactPerson.map((details) => ({
      contact_name: details.contactName,
      contact_designation: details.contactDesignation,
      contact_email: details.contactEmail,
      contact_no: details.contactNumber,
      contact_linkedin: details.contactLinkedin,
      athlete_id: BigInt(athleteId),
    }));
    await prisma.dashapp_athletecontact.createMany({
      data: contactData,
    });
  }

  res.status(STATUS_CODE.OK).json({
    message: "Athlete details updated",
  });
});

export const removeAthlete = asyncHandler(async (req, res) => {
  const athleteId = req.params.id;

  if (!athleteId) {
    throw new BadRequestError("Athlete ID not found");
  }

  const athleteExists = await prisma.dashapp_athlete.findUnique({
    where: { id: BigInt(athleteId) },
    select: { id: true },
  });

  if (!athleteExists?.id) {
    throw new NotFoundError("This athlete does not exists");
  }

  await prisma.dashapp_athlete.delete({
    where: { id: BigInt(athleteId) },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.ATHLETE, true);

  res.status(STATUS_CODE.OK).json({
    message: "Athlete deleted",
  });
});

export const getTotalAthletes = asyncHandler(async (_, res) => {
  const count = getAthletesCount();
  res.status(STATUS_CODE.OK).json({
    count,
  });
});

export const getFilteredAthletes = asyncHandler(async (req, res) => {
  const { take, skip } = req.query;
  const {
    ids,
    associationLevelIds,
    costOfAssociation,
    strategyOverview,
    sportIds,
    agencyIds,
    ageIds,
    facebook,
    instagram,
    twitter,
    linkedin,
    youtube,
    website,
    subPersonalityTraitIds,
    genderIds,
    athleteGenderIds,
    nccsIds,
    primaryMarketIds,
    tierIds,
    secondaryMarketIds,
    tertiaryIds,
    stateIds,
    nationalityIds,
    primarySocialMediaPlatformIds,
    secondarySocialMediaPlatformIds,
    athleteStatusIds,
    athleteAge,
    contactName,
    contactDesignation,
    contactEmail,
    contactNumber,
    contactLinkedin,
    isMandatory,
  } = req.validatedData as TFilteredAthleteSchema;

  const today = new Date();

  const getAgeRangeQuery = () => {
    if (athleteAge?.age?.length) {
      const [lowerAge, upperAge] = athleteAge.age;

      const lowerBoundDate = new Date(today);
      lowerBoundDate.setFullYear(lowerBoundDate.getFullYear() - lowerAge);

      const lowerBoundStartDate = new Date(today);
      lowerBoundStartDate.setFullYear(lowerBoundStartDate.getFullYear() - lowerAge);
      lowerBoundStartDate.setDate(1);
      lowerBoundStartDate.setMonth(0);

      const lowerBoundYear = new Date(today);
      lowerBoundYear.setFullYear(lowerBoundYear.getFullYear() - lowerAge + 1);
      lowerBoundYear.setDate(1);
      lowerBoundYear.setMonth(0);

      const upperBoundStartDate = new Date(today);
      upperBoundStartDate.setFullYear(upperBoundStartDate.getFullYear() - upperAge);
      upperBoundStartDate.setDate(1);
      upperBoundStartDate.setMonth(0);

      const upperBoundYear = new Date(today);
      upperBoundYear.setFullYear(upperBoundYear.getFullYear() - upperAge + 1);
      upperBoundYear.setDate(1);
      upperBoundYear.setMonth(0);

      const upperBoundDate = new Date(today);
      upperBoundDate.setFullYear(upperBoundDate.getFullYear() - upperAge);

      if (athleteAge.age.length === 2) {
        return {
          OR: [
            {
              AND: [
                {
                  age: {
                    gte: formatDob(upperBoundStartDate),
                  },
                },
                {
                  age: {
                    lte: formatDob(upperBoundDate),
                  },
                },
              ],
            },
            {
              AND: [
                {
                  age: {
                    gte: formatDob(upperBoundYear),
                  },
                },
                {
                  age: {
                    lte: formatDob(lowerBoundDate),
                  },
                },
              ],
            },
          ],
        };
      } else if (athleteAge.age.length === 1) {
        const operationConditions =
          athleteAge.operationType === "gte"
            ? {
                age: {
                  lte: formatDob(lowerBoundDate),
                },
              }
            : athleteAge.operationType === "lte"
              ? {
                  OR: [
                    {
                      AND: [
                        {
                          age: {
                            gte: formatDob(lowerBoundStartDate),
                          },
                        },
                        {
                          age: {
                            lte: formatDob(lowerBoundDate),
                          },
                        },
                      ],
                    },
                    {
                      age: {
                        gte: formatDob(lowerBoundYear),
                      },
                    },
                  ],
                }
              : athleteAge.operationType === "equals"
                ? {
                    age: {
                      equals: formatDob(lowerBoundDate),
                    },
                  }
                : undefined;

        return operationConditions || undefined;
      }
    } else {
      return undefined;
    }
  };

  const filterConditions: Prisma.dashapp_athleteWhereInput = {
    id: ids?.length ? { in: ids.map((id) => BigInt(id)) } : undefined,

    ...(athleteAge?.age?.length && getAgeRangeQuery()),

    dashapp_athlete_association:
      associationLevelIds?.length || costOfAssociation?.cost?.length
        ? {
            every: {
              association_level_id: associationLevelIds?.length
                ? {
                    in: associationLevelIds.map((id) => BigInt(id)),
                  }
                : undefined,
              cost: costOfAssociation?.cost?.length ? getCostQuery(costOfAssociation) : undefined,
            },
          }
        : undefined,

    strategy_overview: strategyOverview
      ? {
          contains: strategyOverview,
          mode: "insensitive",
        }
      : undefined,

    dashapp_sport: sportIds?.length
      ? {
          id: { in: sportIds.map((id) => BigInt(id)) },
        }
      : undefined,

    dashapp_agency: agencyIds?.length
      ? {
          id: { in: agencyIds.map((id) => BigInt(id)) },
        }
      : undefined,

    dashapp_athlete_status: athleteStatusIds?.length
      ? {
          id: { in: athleteStatusIds.map((id) => BigInt(id)) },
        }
      : undefined,

    nationality: nationalityIds?.length
      ? {
          id: { in: nationalityIds.map((id) => BigInt(id)) },
        }
      : undefined,

    dashapp_athlete_tier: tierIds?.length
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

    dashapp_states: stateIds?.length
      ? {
          id: { in: stateIds.map((id) => BigInt(id)) },
        }
      : undefined,

    dashapp_athlete_target_age: ageIds?.length
      ? {
          //   none: {
          //       dashapp_age: {
          //           id: { notIn: ageIds.map((id) => BigInt(id)) },
          //       },
          //   },
          some: {
            dashapp_age: {
              id: { in: ageIds.map((id) => BigInt(id)) },
            },
          },
        }
      : undefined,

    dashapp_athlete_personality_traits: subPersonalityTraitIds?.length
      ? {
          //   none: {
          //       dashapp_subpersonality: {
          //           id: {
          //               notIn: subPersonalityTraitIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
          some: {
            dashapp_subpersonality: {
              id: {
                in: subPersonalityTraitIds.map((id) => BigInt(id)),
              },
            },
          },
        }
      : undefined,

    dashapp_gender: athleteGenderIds?.length ? await getGenderQuery(athleteGenderIds) : undefined,

    dashapp_athlete_target_gender: genderIds?.length
      ? {
          //   none:
          //       isMandatory === true
          //           ? {
          //                 dashapp_gender: {
          //                     NOT: await getGenderQuery(genderIds),
          //                 },
          //             }
          //           : undefined,
          some: {
            dashapp_gender: await getGenderQuery(genderIds),
          },
        }
      : undefined,

    dashapp_athlete_target_income: nccsIds?.length
      ? {
          //   none: {
          //       dashapp_nccs: {
          //           id: { notIn: nccsIds.map((id) => BigInt(id)) },
          //       },
          //   },
          some: {
            dashapp_nccs: {
              id: { in: nccsIds.map((id) => BigInt(id)) },
            },
          },
        }
      : undefined,

    dashapp_athlete_key_markets_primary: primaryMarketIds?.length
      ? {
          //   none: {
          //       dashapp_keymarket: {
          //           id: { notIn: primaryMarketIds.map((id) => BigInt(id)) },
          //       },
          //   },
          some: {
            dashapp_keymarket: {
              id: { in: primaryMarketIds.map((id) => BigInt(id)) },
            },
          },
        }
      : undefined,

    dashapp_athlete_key_markets_secondary: secondaryMarketIds?.length
      ? {
          //   none: {
          //       dashapp_keymarket: {
          //           id: { notIn: secondaryMarketIds.map((id) => BigInt(id)) },
          //       },
          //   },
          some: {
            dashapp_keymarket: {
              id: { in: secondaryMarketIds.map((id) => BigInt(id)) },
            },
          },
        }
      : undefined,

    dashapp_athlete_key_markets_tertiary: tertiaryIds?.length
      ? {
          //   none: {
          //       dashapp_states: {
          //           id: { notIn: tertiaryIds.map((id) => BigInt(id)) },
          //       },
          //   },
          some: {
            dashapp_states: {
              id: { in: tertiaryIds.map((id) => BigInt(id)) },
            },
          },
        }
      : undefined,

    dashapp_athlete_socialmedia_platform_primary: primarySocialMediaPlatformIds?.length
      ? {
          //   none: {
          //       dashapp_socialmedia_platform: {
          //           id: {
          //               notIn: primarySocialMediaPlatformIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
          some: {
            dashapp_socialmedia_platform: {
              id: {
                in: primarySocialMediaPlatformIds.map((id) => BigInt(id)),
              },
            },
          },
        }
      : undefined,

    dashapp_athlete_socialmedia_platform_secondary: secondarySocialMediaPlatformIds?.length
      ? {
          //   none: {
          //       dashapp_socialmedia_platform: {
          //           id: {
          //               notIn: secondarySocialMediaPlatformIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
          some: {
            dashapp_socialmedia_platform: {
              id: {
                in: secondarySocialMediaPlatformIds.map((id) => BigInt(id)),
              },
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

    dashapp_athletecontact:
      contactName || contactDesignation || contactEmail || contactNumber
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

  const combinedFilterConditions =
    isMandatory === true
      ? filterConditions
      : {
          OR: Object.entries(filterConditions)
            .filter(([_, condition]) => condition)
            .map(([key, condition]) => ({ [key]: condition })),
        };

  const athletes = await getAthletes({
    query: combinedFilterConditions,
    take,
    skip,
    select: athleteSelect,
  });

  if (athletes.length < 1) {
    throw new NotFoundError("No athletes found for the given filters");
  }

  const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
    where: {
      dashapp_subpersonality: {
        some: {
          dashapp_athlete_personality_traits: {
            some: { athlete_id: { in: athletes.map((athlete) => athlete.id) } },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      dashapp_subpersonality: {
        where: {
          dashapp_athlete_personality_traits: {
            some: { athlete_id: { in: athletes.map((athlete) => athlete.id) } },
          },
        },
        select: {
          id: true,
          name: true,
          dashapp_athlete_personality_traits: {
            select: {
              athlete_id: true,
            },
          },
        },
      },
    },
  });

  const personalitiesByAthleteId: Record<string, typeof mainPersonalities> = {};

  mainPersonalities.forEach((personality) => {
    personality.dashapp_subpersonality.forEach((subPersonality) => {
      const athleteIds = subPersonality.dashapp_athlete_personality_traits.map((trait) => trait.athlete_id);

      athleteIds.forEach((athleteId) => {
        const athleteIdStr = athleteId.toString();

        if (!personalitiesByAthleteId[athleteIdStr]) {
          personalitiesByAthleteId[athleteIdStr] = [];
        }

        const alreadyAdded = personalitiesByAthleteId[athleteIdStr].some((p) => p.id === personality.id);

        if (!alreadyAdded) {
          const filteredPersonality = {
            ...personality,
            dashapp_subpersonality: personality.dashapp_subpersonality.filter((sub) =>
              sub.dashapp_athlete_personality_traits.some((trait) => trait.athlete_id.toString() === athleteIdStr),
            ),
          };

          personalitiesByAthleteId[athleteIdStr].push(filteredPersonality);
        }
      });
    });
  });

  const updatedAthletes = athletes.map((athlete) => ({
    ...athlete,
    mainPersonalities: personalitiesByAthleteId[athlete.id.toString()] || [],
  }));

  let filteredAthletes = updatedAthletes;

  // 1. Exact filtering for dashapp_athlete_target_age
  if (ageIds?.length) {
    const requiredAgeIds = ageIds.map((id) => BigInt(id).toString());
    filteredAthletes = filteredAthletes.filter((athlete) => {
      console.log("names:", athlete.athlete_name);
      const athleteAgeIds = athlete.dashapp_athlete_target_age.map((entry: any) => {
        return entry.dashapp_age.id.toString();
      });
      return exactSetMatch(athleteAgeIds, requiredAgeIds);
    });
  }

  // 2. Exact filtering for dashapp_athlete_personality_traits
  if (subPersonalityTraitIds?.length) {
    const requiredTraitIds = subPersonalityTraitIds.map((id) => BigInt(id).toString());
    filteredAthletes = filteredAthletes.filter((athlete) => {
      const athleteTraitIds = athlete.mainPersonalities.flatMap((entry: any) =>
        entry.dashapp_subpersonality.map((sub: any) => sub.id.toString()),
      );
      return exactSetMatch(athleteTraitIds, requiredTraitIds);
    });
  }

  // 3. Exact filtering for dashapp_athlete_tier
  if (tierIds?.length) {
    const requiredGenderIds = tierIds.map((id) => id.toString());
    filteredAthletes = filteredAthletes.filter((athlete) => {
      // Assuming athlete.dashapp_athlete_tier is an array with dashapp_gender objects.
      const athleteGenderIds = athlete.dashapp_athlete_tier.map((entry: any) => entry.dashapp_tier.id.toString());
      return exactSetMatch(athleteGenderIds, requiredGenderIds);
    });
  }

  // 4. Exact filtering for dashapp_athlete_target_income
  if (nccsIds?.length) {
    const requiredNccsIds = nccsIds.map((id) => BigInt(id).toString());
    filteredAthletes = filteredAthletes.filter((athlete) => {
      // Assuming athlete.dashapp_athlete_target_income is an array of objects with dashapp_nccs id.
      const athleteNccsIds = athlete.dashapp_athlete_target_income.map((entry: any) =>
        entry.dashapp_nccs.id.toString(),
      );
      return exactSetMatch(athleteNccsIds, requiredNccsIds);
    });
  }

  // 5. Exact filtering for dashapp_athlete_key_markets_primary
  if (primaryMarketIds?.length) {
    const requiredPrimaryIds = primaryMarketIds.map((id) => BigInt(id).toString());
    filteredAthletes = filteredAthletes.filter((athlete) => {
      // Assuming athlete.dashapp_athlete_key_markets_primary is an array of objects with dashapp_keymarket.
      const athletePrimaryIds = athlete.dashapp_athlete_key_markets_primary.map((entry: any) =>
        entry.dashapp_keymarket.id.toString(),
      );
      return exactSetMatch(athletePrimaryIds, requiredPrimaryIds);
    });
  }

  // 6. Exact filtering for dashapp_athlete_key_markets_secondary
  if (secondaryMarketIds?.length) {
    const requiredSecondaryIds = secondaryMarketIds.map((id) => BigInt(id).toString());
    filteredAthletes = filteredAthletes.filter((athlete) => {
      // Assuming relation field is an array of objects with dashapp_keymarket.
      const athleteSecondaryIds = athlete.dashapp_athlete_key_markets_secondary.map((entry: any) =>
        entry.dashapp_keymarket.id.toString(),
      );
      return exactSetMatch(athleteSecondaryIds, requiredSecondaryIds);
    });
  }

  // 7. Exact filtering for dashapp_athlete_key_markets_tertiary
  if (tertiaryIds?.length) {
    const requiredTertiaryIds = tertiaryIds.map((id) => BigInt(id).toString());
    filteredAthletes = filteredAthletes.filter((athlete) => {
      // Assuming athlete.dashapp_athlete_key_markets_tertiary is an array of objects with dashapp_states.
      const athleteTertiaryIds = athlete.dashapp_athlete_key_markets_tertiary.map((entry: any) =>
        entry.dashapp_states.id.toString(),
      );
      return exactSetMatch(athleteTertiaryIds, requiredTertiaryIds);
    });
  }

  // 8. Exact filtering for dashapp_athlete_socialmedia_platform_primary
  if (primarySocialMediaPlatformIds?.length) {
    const requiredPrimarySocialIds = primarySocialMediaPlatformIds.map((id) => BigInt(id).toString());
    filteredAthletes = filteredAthletes.filter((athlete) => {
      // Assuming athlete.dashapp_athlete_socialmedia_platform_primary is an array with dashapp_socialmedia_platform.
      const athletePrimarySocialIds = athlete.dashapp_athlete_socialmedia_platform_primary.map((entry: any) =>
        entry.dashapp_socialmedia_platform.id.toString(),
      );
      return exactSetMatch(athletePrimarySocialIds, requiredPrimarySocialIds);
    });
  }

  // 9. Exact filtering for dashapp_athlete_socialmedia_platform_secondary
  if (secondarySocialMediaPlatformIds?.length) {
    const requiredSecondarySocialIds = secondarySocialMediaPlatformIds.map((id) => BigInt(id).toString());
    filteredAthletes = filteredAthletes.filter((athlete) => {
      // Assuming athlete.dashapp_athlete_socialmedia_platform_secondary is an array with dashapp_socialmedia_platform.
      const athleteSecondarySocialIds = athlete.dashapp_athlete_socialmedia_platform_secondary.map((entry: any) =>
        entry.dashapp_socialmedia_platform.id.toString(),
      );
      return exactSetMatch(athleteSecondarySocialIds, requiredSecondarySocialIds);
    });
  }

  const modifiedAthletes =
    genderIds?.length === 2
      ? filteredAthletes.filter((athlete) => athlete.dashapp_athlete_target_gender.length === 2)
      : filteredAthletes;

  const athleteResponse: AthleteResponseDTO[] = modifiedAthletes.map((athlete) =>
    AthleteResponseDTO.toResponse(athlete as unknown as TAthleteDetails),
  );

  res.status(200).json(athleteResponse);
});
