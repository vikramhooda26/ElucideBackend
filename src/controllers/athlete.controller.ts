import { Prisma } from "@prisma/client";
import { differenceInYears, parseISO } from "date-fns";
import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { AthleteResponseDTO } from "../dto/athlete.dto.js";
import { STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { areElementsDistinct } from "../lib/helpers.js";
import { printLogs } from "../lib/log.js";
import {
    TCreateAthleteSchema,
    TEditAthleteSchema,
    TFilteredAthleteSchema,
} from "../schemas/athlete.schema.js";
import { athleteSelect } from "../types/athlete.type.js";
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
        if (
            (minAge && maxAge && age >= minAge && age <= maxAge) ||
            ((!maxAge || maxAge === 0) && age >= minAge)
        ) {
            matchedAgeRange = range.age_range;
            return true;
        } else {
            return false;
        }
    });

    return matchedAgeRange;
};

export const getAllAthletes = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const athletes = await prisma.dashapp_athlete.findMany({
        select: {
            id: true,
            athlete_name: true,
            nationality: { select: { name: true } },
            created_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            created_date: true,
            modified_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            modified_date: true,
            _count: true,
        },
        orderBy: { modified_date: "desc" },
        take: Number.isNaN(Number(take)) ? undefined : Number(take),
        skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
    });

    if (athletes.length < 1) {
        throw new NotFoundError("Athlete data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        athletes.map((athlete) => ({
            id: athlete.id,
            name: athlete.athlete_name,
            nationality: athlete.nationality?.name,
            createdDate: athlete.created_date,
            modifiedDate: athlete.modified_date,
            createdBy: {
                userId: athlete.created_by?.id,
                email: athlete.created_by?.email,
            },
            modifiedBy: {
                userId: athlete.modified_by?.id,
                email: athlete.modified_by?.email,
            },
            count: athlete._count,
        })),
    );
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
                        some: {
                            athlete_id: BigInt(athleteId),
                        },
                    },
                },
            },
        },
    });

    const updatedAthlete = {
        ...athlete,
        mainPersonalities,
    };

    const athleteResponse: AthleteResponseDTO =
        AthleteResponseDTO.toResponse(updatedAthlete);

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
        const isDistinct = areElementsDistinct(
            association?.map((association) => association.associationLevelId),
        );

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
            dashapp_athlete_socialmedia_platform_primary:
                primarySocialMediaPlatformIds?.length
                    ? {
                          create: primarySocialMediaPlatformIds.map(
                              (platformId) => ({
                                  dashapp_socialmedia_platform: {
                                      connect: { id: BigInt(platformId) },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_athlete_socialmedia_platform_secondary:
                secondarySocialMediaPlatformIds?.length
                    ? {
                          create: secondarySocialMediaPlatformIds.map(
                              (platformId) => ({
                                  dashapp_socialmedia_platform: {
                                      connect: { id: BigInt(platformId) },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_sport: sportId
                ? {
                      connect: { id: BigInt(sportId) },
                  }
                : undefined,
            nationality: nationalityId
                ? { connect: { id: BigInt(nationalityId) } }
                : undefined,
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
        const isDistinct = areElementsDistinct(
            association?.map((association) => association.associationLevelId),
        );

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
            modified_by: userId
                ? { connect: { id: BigInt(userId) } }
                : { disconnect: true },
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
                          create: primarySocialMediaPlatformIds.map(
                              (primarySocialMediaId) => ({
                                  dashapp_socialmedia_platform: {
                                      connect: {
                                          id: BigInt(primarySocialMediaId),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined),
            },
            dashapp_athlete_socialmedia_platform_secondary: {
                deleteMany: {},
                ...(secondarySocialMediaPlatformIds?.length
                    ? {
                          create: secondarySocialMediaPlatformIds.map(
                              (secondarySocialMediaId) => ({
                                  dashapp_socialmedia_platform: {
                                      connect: {
                                          id: BigInt(secondarySocialMediaId),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined),
            },
            dashapp_agency: agencyId
                ? { connect: { id: BigInt(agencyId) } }
                : { disconnect: true },
            dashapp_sport: sportId
                ? { connect: { id: BigInt(sportId) } }
                : { disconnect: true },
            nationality: nationalityId
                ? { connect: { id: BigInt(nationalityId) } }
                : { disconnect: true },
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

    await prisma.dashapp_athletecontact.deleteMany();

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
    });

    res.status(STATUS_CODE.OK).json({
        message: "Athlete deleted",
    });
});

export const getTotalAthletes = asyncHandler(async (req, res) => {
    const count = getAthletesCount();
    res.status(STATUS_CODE.OK).json({
        count,
    });
});

export const getFilteredAthletes = asyncHandler(async (req, res) => {
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
        statusIds,
        athleteAge,
        contactName,
        contactDesignation,
        contactEmail,
        contactNumber,
        contactLinkedin,
    } = req.validatedData as TFilteredAthleteSchema;

    const filterConditions: Prisma.dashapp_athleteWhereInput = {
        id: ids?.length ? { in: ids.map((id) => BigInt(id)) } : undefined,

        dashapp_athlete_association: associationLevelIds?.length
            ? {
                  some: {
                      association_level_id: {
                          in: associationLevelIds.map((id) => BigInt(id)),
                      },
                  },
              }
            : undefined,

        ...(costOfAssociation?.cost?.length === 2 && {
            dashapp_athlete_association: {
                some: {
                    cost: {
                        ...(costOfAssociation.operationType === "in" && {
                            gte: new Prisma.Decimal(costOfAssociation.cost[0]),
                            lte: new Prisma.Decimal(costOfAssociation.cost[1]),
                        }),
                        ...(costOfAssociation.operationType === "notIn" && {
                            OR: [
                                {
                                    lte: new Prisma.Decimal(
                                        costOfAssociation.cost[0],
                                    ),
                                },
                                {
                                    gte: new Prisma.Decimal(
                                        costOfAssociation.cost[1],
                                    ),
                                },
                            ],
                        }),
                    },
                },
            },
        }),

        ...(costOfAssociation?.cost?.length === 1 && {
            dashapp_athlete_association: {
                some: {
                    cost: {
                        ...(costOfAssociation.operationType === "gt" && {
                            gte: new Prisma.Decimal(costOfAssociation.cost[0]),
                        }),
                        ...(costOfAssociation.operationType === "lt" && {
                            lte: new Prisma.Decimal(costOfAssociation.cost[0]),
                        }),
                    },
                },
            },
        }),

        age:
            athleteAge?.age?.length === 2
                ? {
                      ...(athleteAge.operationType === "in" && {
                          gte: athleteAge.age[0],
                          lte: athleteAge.age[1],
                      }),
                      ...(athleteAge.operationType === "notIn" && {
                          OR: [
                              { lt: athleteAge.age[0] },
                              { gt: athleteAge.age[1] },
                          ],
                      }),
                  }
                : athleteAge?.age?.length === 1
                  ? {
                        ...(athleteAge.operationType === "gt" && {
                            gt: athleteAge.age[0],
                        }),
                        ...(athleteAge.operationType === "lt" && {
                            lte: athleteAge.age[0],
                        }),
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

        dashapp_athlete_target_age: ageIds?.length
            ? {
                  some: {
                      dashapp_age: {
                          id: { in: ageIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        facebook: facebook
            ? { contains: facebook, mode: "insensitive" }
            : undefined,
        instagram: instagram
            ? { contains: instagram, mode: "insensitive" }
            : undefined,
        twitter: twitter
            ? { contains: twitter, mode: "insensitive" }
            : undefined,
        linkedin: linkedin
            ? { contains: linkedin, mode: "insensitive" }
            : undefined,
        youtube: youtube
            ? { contains: youtube, mode: "insensitive" }
            : undefined,
        website: website
            ? { contains: website, mode: "insensitive" }
            : undefined,

        dashapp_athlete_personality_traits: subPersonalityTraitIds?.length
            ? {
                  some: {
                      dashapp_subpersonality: {
                          id: {
                              in: subPersonalityTraitIds.map((id) =>
                                  BigInt(id),
                              ),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_gender: genderIds?.length
            ? {
                  id: { in: genderIds.map((id) => BigInt(id)) },
              }
            : undefined,

        dashapp_athlete_target_gender: athleteGenderIds?.length
            ? {
                  some: {
                      dashapp_gender: {
                          id: { in: athleteGenderIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_athlete_target_income: nccsIds?.length
            ? {
                  some: {
                      dashapp_nccs: {
                          id: { in: nccsIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_athlete_key_markets_primary: primaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: { in: primaryMarketIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_athlete_key_markets_secondary: secondaryMarketIds?.length
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

        dashapp_athlete_key_markets_tertiary: tertiaryIds?.length
            ? {
                  some: {
                      dashapp_states: {
                          id: { in: tertiaryIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_states: stateIds?.length
            ? {
                  id: { in: stateIds.map((id) => BigInt(id)) },
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
              }
            : undefined,

        dashapp_athlete_status: statusIds?.length
            ? {
                  id: { in: statusIds.map((id) => BigInt(id)) },
              }
            : undefined,

        dashapp_athlete_socialmedia_platform_primary:
            primarySocialMediaPlatformIds?.length
                ? {
                      some: {
                          dashapp_socialmedia_platform: {
                              id: {
                                  in: primarySocialMediaPlatformIds.map((id) =>
                                      BigInt(id),
                                  ),
                              },
                          },
                      },
                  }
                : undefined,

        dashapp_athlete_socialmedia_platform_secondary:
            secondarySocialMediaPlatformIds?.length
                ? {
                      some: {
                          dashapp_socialmedia_platform: {
                              id: {
                                  in: secondarySocialMediaPlatformIds.map(
                                      (id) => BigInt(id),
                                  ),
                              },
                          },
                      },
                  }
                : undefined,

        ...(contactName?.length && {
            contactName: {
                contains: contactName,
                mode: "insensitive",
            },
        }),
        ...(contactDesignation?.length && {
            contactDesignation: {
                contains: contactDesignation,
                mode: "insensitive",
            },
        }),
        ...(contactEmail?.length && {
            contactEmail: {
                contains: contactEmail,
                mode: "insensitive",
            },
        }),
        ...(contactNumber?.length && {
            contactNumber: {
                contains: contactNumber,
            },
        }),
        ...(contactLinkedin?.length && {
            contactLinkedin: {
                contains: contactLinkedin,
                mode: "insensitive",
            },
        }),
    };

    const athletes = await prisma.dashapp_athlete.findMany({
        where: filterConditions,
        select: athleteSelect,
        orderBy: { modified_date: "desc" },
    });

    if (athletes.length < 1) {
        throw new NotFoundError("No athletes found for the given filters");
    }

    printLogs("Filtered athletes details:", athletes);

    res.status(STATUS_CODE.OK).json(athletes);
});
