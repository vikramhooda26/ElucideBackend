import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { prisma } from "../db/index.js";
import { STATUS_CODE } from "../lib/constants.js";
import {
    TCreateAthleteSchema,
    TEditAthleteSchema,
} from "../schemas/athlete.schema.js";
import { athleteSelect } from "../types/athlete.type.js";
import { AthleteResponseDTO } from "../dto/athlete.dto.js";

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

    if (!athlete) {
        throw new NotFoundError("This athlete does not exists");
    }

    const athleteResponse: AthleteResponseDTO =
        AthleteResponseDTO.toResponse(athlete);

    res.status(STATUS_CODE.OK).json(athleteResponse);
});

export const getAllAthletes = asyncHandler(async (req, res) => {
    const athletes = await prisma.dashapp_athlete.findMany({
        select: {
            id: true,
            athlete_name: true,
            created_by: {
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    username: true,
                },
            },
            created_date: true,
            modified_by: {
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    username: true,
                },
            },
            modified_date: true,
        },
        orderBy: { created_date: "desc" },
    });

    if (athletes.length < 1) {
        throw new NotFoundError("Athlete data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        athletes.map((athlete) => ({
            id: athlete.id,
            athleteName: athlete.athlete_name,
            createdDate: athlete.created_date,
            modifiedData: athlete.modified_date,
            createdBy: {
                userId: athlete.created_by?.id,
                email: athlete.created_by?.email,
                firstName: athlete.created_by?.first_name,
                lastName: athlete.created_by?.last_name,
                username: athlete.created_by?.username,
            },
            modifiedBy: {
                userId: athlete.modified_by?.id,
                email: athlete.modified_by?.email,
                firstName: athlete.modified_by?.first_name,
                lastName: athlete.modified_by?.last_name,
                username: athlete.modified_by?.username,
            },
        })),
    );
});

export const createAthlete = asyncHandler(async (req, res) => {
    const {
        athleteName,
        age,
        genderId,
        incomeId,
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
        nationality,
        subPersonalityTraitIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
    } = req.validatedData as TCreateAthleteSchema;

    const ageRange = age ? await findAgeRange(Number(age)) : undefined;

    console.log("\n\nageRange:", ageRange);

    await prisma.dashapp_athlete.create({
        data: {
            athlete_name: athleteName,
            association: associationId
                ? { connect: { id: BigInt(associationId) } }
                : undefined,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
            facebook: facebook ?? null,
            instagram: instagram ?? null,
            twitter: twitter ?? null,
            linkedin: linkedin ?? null,
            youtube: youtube ?? null,
            website: website ?? null,
            dashapp_agency: agencyId
                ? { connect: { id: BigInt(agencyId) } }
                : undefined,
            dashapp_sport: { connect: { id: BigInt(sportId) } },
            nationality,
            dashapp_athlete_personality_traits: {
                create: subPersonalityTraitIds?.map((traitId) => ({
                    dashapp_subpersonality: {
                        connect: { id: BigInt(traitId) },
                    },
                })),
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
                create: incomeId
                    ? {
                          dashapp_income: { connect: { id: BigInt(incomeId) } },
                      }
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
        athleteName,
        age,
        genderId,
        incomeId,
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
        nationality,
        subPersonalityTraitIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
    } = req.validatedData as TEditAthleteSchema;

    const ageRange = age ? await findAgeRange(Number(age)) : undefined;

    await prisma.dashapp_athlete.update({
        where: { id: BigInt(athleteId) },
        data: {
            athlete_name: athleteName,
            age: Number(age),
            association: associationId
                ? { connect: { id: BigInt(associationId) } }
                : undefined,
            modified_by: userId
                ? { connect: { id: BigInt(userId) } }
                : undefined,
            facebook: facebook ?? undefined,
            instagram: instagram ?? undefined,
            twitter: twitter ?? undefined,
            linkedin: linkedin ?? undefined,
            youtube: youtube ?? undefined,
            website: website ?? undefined,
            dashapp_agency: agencyId
                ? { connect: { id: BigInt(agencyId) } }
                : undefined,
            dashapp_sport: sportId
                ? { connect: { id: BigInt(sportId) } }
                : undefined,
            nationality,
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
                create: incomeId
                    ? {
                          dashapp_income: { connect: { id: BigInt(incomeId) } },
                      }
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

    await prisma.dashapp_athlete.delete({
        where: { id: BigInt(athleteId) },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Athlete deleted",
    });
});
