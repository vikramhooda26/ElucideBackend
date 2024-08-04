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

const findAgeRange = async (age: number): Promise<string | undefined> => {
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

export const createAthlete = asyncHandler(async (req, res) => {
    const {
        name,
        age,
        genderId,
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
        associationLevelId,
        costOfAssociation,
        statusId,
        stateId,
    } = req.validatedData as TCreateAthleteSchema;

    const ageRange = age ? await findAgeRange(Number(age)) : undefined;

    console.log("\n\nageRange:", ageRange);

    await prisma.dashapp_athlete.create({
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
            dashapp_agency: {
                connect: agencyId ? { id: BigInt(agencyId) } : undefined,
            },
            dashapp_states: {
                connect: stateId ? { id: BigInt(stateId) } : undefined,
            },
            dashapp_athlete_status: {
                connect: statusId ? { id: BigInt(statusId) } : undefined,
            },
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
            dashapp_athlete_socialmedia_platform_primary:
                primarySocialMediaPlatformIds
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
                secondarySocialMediaPlatformIds
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
            dashapp_sport: {
                connect: sportId ? { id: BigInt(sportId) } : undefined,
            },
            nationality: nationalityId
                ? { connect: { id: BigInt(nationalityId) } }
                : undefined,
            dashapp_athlete_personality_traits: {
                create: subPersonalityTraitIds
                    ? subPersonalityTraitIds.map((traitId) => ({
                          dashapp_subpersonality: {
                              connect: { id: BigInt(traitId) },
                          },
                      }))
                    : undefined,
            },
            age: Number(age),
            dashapp_athlete_target_age: {
                create: ageRange
                    ? {
                          dashapp_age: {
                              connect: { age_range: ageRange },
                          },
                      }
                    : undefined,
            },
            dashapp_athlete_target_gender: {
                create: genderId
                    ? {
                          dashapp_gender: { connect: { id: BigInt(genderId) } },
                      }
                    : undefined,
            },
            dashapp_athlete_target_income: {
                create: nccsIds
                    ? nccsIds.map((nccsId) => ({
                          dashapp_nccs: { connect: { id: BigInt(nccsId) } },
                      }))
                    : undefined,
            },
            dashapp_athlete_key_markets_primary: {
                create: primaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_athlete_key_markets_secondary: {
                create: secondaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_athlete_key_markets_tertiary: {
                create: tertiaryIds?.map((tertiaryId) => ({
                    dashapp_states: { connect: { id: BigInt(tertiaryId) } },
                })),
            },
        },
        select: {
            id: true,
        },
    });

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
        age,
        genderId,
        nccsIds,
        associationId,
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
        associationLevelId,
        costOfAssociation,
        primarySocialMediaPlatformIds,
        secondarySocialMediaPlatformIds,
        statusId,
        stateId,
    } = req.validatedData as TEditAthleteSchema;

    const ageRange = age ? await findAgeRange(Number(age)) : undefined;

    await prisma.dashapp_athlete.update({
        where: { id: BigInt(athleteId) },
        data: {
            athlete_name: name,
            age: Number(age),
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
            modified_by: userId
                ? { connect: { id: BigInt(userId) } }
                : undefined,
            dashapp_states: {
                connect: stateId ? { id: BigInt(stateId) } : undefined,
            },
            facebook: facebook ?? undefined,
            instagram: instagram ?? undefined,
            twitter: twitter ?? undefined,
            linkedin: linkedin ?? undefined,
            youtube: youtube ?? undefined,
            website: website ?? undefined,
            dashapp_athlete_status: {
                connect: statusId ? { id: BigInt(statusId) } : undefined,
            },
            dashapp_athlete_socialmedia_platform_primary:
                primarySocialMediaPlatformIds
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
                    : undefined,
            dashapp_athlete_socialmedia_platform_secondary:
                secondarySocialMediaPlatformIds
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
            dashapp_athlete_personality_traits: {
                deleteMany: {},
                create: subPersonalityTraitIds?.map((traitId) => ({
                    dashapp_subpersonality: {
                        connect: { id: BigInt(traitId) },
                    },
                })),
            },
            dashapp_athlete_target_age: {
                deleteMany: {},
                create: ageRange
                    ? { dashapp_age: { connect: { age_range: ageRange } } }
                    : undefined,
            },
            dashapp_athlete_target_gender: {
                deleteMany: {},
                create: genderId
                    ? {
                          dashapp_gender: { connect: { id: BigInt(genderId) } },
                      }
                    : undefined,
            },
            dashapp_athlete_target_income: {
                deleteMany: {},
                create: nccsIds
                    ? nccsIds.map((nccsId) => ({
                          dashapp_nccs: { connect: { id: BigInt(nccsId) } },
                      }))
                    : undefined,
            },
            dashapp_athlete_key_markets_primary: {
                deleteMany: {},
                create: primaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_athlete_key_markets_secondary: {
                deleteMany: {},
                create: secondaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_athlete_key_markets_tertiary: {
                deleteMany: {},
                create: tertiaryIds?.map((tertiaryId) => ({
                    dashapp_states: { connect: { id: BigInt(tertiaryId) } },
                })),
            },
        },
    });

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
