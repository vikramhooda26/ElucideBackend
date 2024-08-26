import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { AthleteResponseDTO } from "../dto/athlete.dto.js";
import { STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import {
    TCreateAthleteSchema,
    TEditAthleteSchema,
    TFilteredAthleteSchema,
} from "../schemas/athlete.schema.js";
import { athleteSelect } from "../types/athlete.type.js";
import { buildAthleteFilterQuery } from "../lib/buildAthleteFilterQuery.js";
import { printLogs } from "../lib/log.js";
import { differenceInYears, parseISO } from "date-fns";
import { areElementsDistinct } from "../lib/helpers.js";
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

    const athleteResponse: AthleteResponseDTO =
        AthleteResponseDTO.toResponse(athlete);

    res.status(STATUS_CODE.OK).json(athleteResponse);
});

export const createAthlete = asyncHandler(async (req, res) => {
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
        primarySocialMediaPlatformIds,
        secondarySocialMediaPlatformIds,
        association,
        statusId,
        stateId,
        contactPerson,
        tierIds,
    } = req.validatedData as TCreateAthleteSchema;

    const ageRange = athleteAge ? await findAgeRange(athleteAge) : undefined;

    printLogs("\n\nageRange:", ageRange);

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
            age: athleteAge || undefined,
            dashapp_athlete_target_age: ageRange
                ? {
                      create: {
                          dashapp_age: {
                              connect: { age_range: ageRange },
                          },
                      },
                  }
                : undefined,
            dashapp_athlete_target_gender: genderIds?.length
                ? {
                      create: genderIds.map((genderId) => ({
                          dashapp_gender: { connect: { id: BigInt(genderId) } },
                      })),
                  }
                : undefined,
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
                contact_designation: details.contactDesignation || undefined,
                contact_email: details.contactEmail || undefined,
                contact_no: details.contactNumber || undefined,
                contact_linkedin: details.contactLinkedin || undefined,
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
    } = req.validatedData as TEditAthleteSchema;

    if (association?.length) {
        const isDistinct = areElementsDistinct(
            association?.map((association) => association.associationLevelId),
        );

        if (!isDistinct) {
            throw new BadRequestError("Association Level must be unique");
        }
    }

    const ageRange = athleteAge ? await findAgeRange(athleteAge) : undefined;

    printLogs("age:", athleteAge);

    printLogs("Age range:", ageRange);

    await prisma.dashapp_athlete.update({
        where: { id: BigInt(athleteId) },
        data: {
            athlete_name: name || undefined,
            age: athleteAge || undefined,
            dashapp_athlete_association: {
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
            modified_by: userId
                ? { connect: { id: BigInt(userId) } }
                : undefined,
            dashapp_states: stateId
                ? {
                      connect: { id: BigInt(stateId) },
                  }
                : undefined,
            dashapp_athlete_tier: tierIds
                ? {
                      deleteMany: {},
                      create: tierIds.map((tierId) => ({
                          dashapp_tier: { connect: { id: BigInt(tierId) } },
                      })),
                  }
                : undefined,
            facebook: facebook || undefined,
            instagram: instagram || undefined,
            twitter: twitter || undefined,
            linkedin: linkedin || undefined,
            youtube: youtube || undefined,
            website: website || undefined,
            dashapp_athlete_status: statusId
                ? {
                      connect: { id: BigInt(statusId) },
                  }
                : undefined,
            dashapp_athlete_socialmedia_platform_primary:
                primarySocialMediaPlatformIds
                    ? {
                          deleteMany: {},
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
                    : undefined,
            dashapp_athlete_socialmedia_platform_secondary:
                secondarySocialMediaPlatformIds
                    ? {
                          deleteMany: {},
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
                    : undefined,
            dashapp_agency: agencyId
                ? { connect: { id: BigInt(agencyId) } }
                : undefined,
            dashapp_sport: sportId
                ? { connect: { id: BigInt(sportId) } }
                : undefined,
            nationality: nationalityId
                ? { connect: { id: BigInt(nationalityId) } }
                : undefined,
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
            dashapp_athlete_target_age: ageRange
                ? {
                      deleteMany: {},
                      create: {
                          dashapp_age: { connect: { age_range: ageRange } },
                      },
                  }
                : undefined,
            dashapp_athlete_target_gender: genderIds
                ? {
                      deleteMany: {},
                      create: genderIds.map((genderId) => ({
                          dashapp_gender: {
                              connect: { id: BigInt(genderId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_athlete_target_income: nccsIds
                ? {
                      deleteMany: {},
                      create: nccsIds.map((nccsId) => ({
                          dashapp_nccs: { connect: { id: BigInt(nccsId) } },
                      })),
                  }
                : undefined,
            dashapp_athlete_key_markets_primary: primaryMarketIds
                ? {
                      deleteMany: {},
                      create: primaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_athlete_key_markets_secondary: secondaryMarketIds
                ? {
                      deleteMany: {},
                      create: secondaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_athlete_key_markets_tertiary: tertiaryIds
                ? {
                      deleteMany: {},
                      create: tertiaryIds?.map((tertiaryId) => ({
                          dashapp_states: {
                              connect: { id: BigInt(tertiaryId) },
                          },
                      })),
                  }
                : undefined,
        },
    });

    if (contactPerson?.length) {
        await prisma.dashapp_athletecontact.deleteMany({
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
                        athlete_id: BigInt(athleteId),
                    },
                ],
            },
        });

        for (const details of contactPerson) {
            await prisma.dashapp_athletecontact.upsert({
                where: { id: BigInt(details.contactId || "") },
                create: {
                    contact_name: details.contactName,
                    contact_designation:
                        details.contactDesignation || undefined,
                    contact_email: details.contactEmail || undefined,
                    contact_no: details.contactNumber || undefined,
                    contact_linkedin: details.contactLinkedin || undefined,
                    dashapp_athlete: {
                        connect: {
                            id: BigInt(athleteId),
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
        await prisma.dashapp_athletecontact.deleteMany({
            where: { athlete_id: BigInt(athleteId) },
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

/**
 * @todo
 * Fix this function, bring the queries inside the prisma findMany call itself.
 * Use null instead of undefined if you do not want the data if not filter is given else use undefined.
 * Send only the data that the get-all method does and then once they click on the list then they will hit the id API to get all the data.
 * For convinience, put the database calls inside a service folder so that they're are reusable like here for instance.
 * Make sure to validate the data coming in regardless
 */

export const getFilteredAthlete = asyncHandler(async (req, res) => {
    const query = buildAthleteFilterQuery(
        req.validatedData as TFilteredAthleteSchema,
    );

    const filteredAthletes = await prisma.dashapp_athlete.findMany({
        where: {
            AND: [
                {
                    age: req.validatedData.age
                        ? {
                              in: req.validatedData.age.map((v: string) =>
                                  parseInt(v, 10),
                              ),
                          }
                        : null,
                },
            ].filter(Boolean),
        },
    });

    res.status(STATUS_CODE.OK).json(filteredAthletes);
});
