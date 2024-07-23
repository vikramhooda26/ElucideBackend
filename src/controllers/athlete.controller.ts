import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { prisma } from "../db/index.js";
import { STATUS_CODE } from "../lib/constants.js";
import {
    TCreateAthleteSchema,
    TEditAthleteSchema,
} from "../schemas/athlete.schema.js";

export const getAthleteById = asyncHandler(async (req, res) => {
    const athleteId = req.params.id;

    if (!athleteId) {
        throw new BadRequestError("Athlete ID not found");
    }

    const athlete = await prisma.dashapp_athlete.findUnique({
        where: { id: BigInt(athleteId) },
    });

    if (!athlete) {
        throw new NotFoundError("This athlete does not exists");
    }

    res.status(STATUS_CODE.OK).json(athlete);
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

    res.status(STATUS_CODE.OK).json(athletes);
});

export const createAthlete = asyncHandler(async (req, res) => {
    const {
        athleteName,
        ageId,
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
            dashapp_athlete_target_age: {
                create: ageId
                    ? { dashapp_age: { connect: { id: BigInt(ageId) } } }
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
    });

    res.status(STATUS_CODE.OK).send("Athlete created");
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
        ageId,
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

    await prisma.dashapp_athlete.update({
        where: { id: BigInt(athleteId) },
        data: {
            athlete_name: athleteName,
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
                create: ageId
                    ? { dashapp_age: { connect: { id: BigInt(ageId) } } }
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

    res.status(STATUS_CODE.OK).send("Athlete updated");
});

export const removeAthlete = asyncHandler(async (req, res) => {
    const athleteId = req.params.id;

    if (!athleteId) {
        throw new BadRequestError("Athlete ID not found");
    }

    await prisma.dashapp_athlete.delete({
        where: { id: BigInt(athleteId) },
    });

    res.status(STATUS_CODE.OK).send("Athlete deleted");
});
