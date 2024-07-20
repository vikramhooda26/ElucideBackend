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
        throw new BadRequestError("id not found");
    }

    const athlete = await prisma.dashapp_athlete.findUnique({
        where: { id: Number(athleteId) },
    });

    if (!athlete?.athlete_name) {
        throw new NotFoundError();
    }

    res.status(STATUS_CODE.OK).json(athlete);
});

export const getAllAthletes = asyncHandler(async (req, res) => {
    const athletes = await prisma.dashapp_athlete.findMany({
        select: { id: true, athlete_name: true },
        orderBy: { created_date: "desc" },
    });

    if (athletes.length < 1) {
        throw new NotFoundError();
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
            association: { connect: { id: associationId } },
            created_by: { connect: { id: userId } },
            modified_by: { connect: { id: userId } },
            facebook: facebook ?? null,
            instagram: instagram ?? null,
            twitter: twitter ?? null,
            linkedin: linkedin ?? null,
            youtube: youtube ?? null,
            website: website ?? null,
            dashapp_agency: { connect: { id: agencyId } },
            dashapp_sport: { connect: { id: sportId } },
            nationality,
            dashapp_athlete_personality_traits: {
                create: subPersonalityTraitIds?.map((traitId) => ({
                    dashapp_subpersonality: {
                        connect: { id: traitId },
                    },
                })),
            },
            dashapp_athlete_target_age: {
                create: { dashapp_age: { connect: { id: ageId } } },
            },
            dashapp_athlete_target_gender: {
                create: { dashapp_gender: { connect: { id: genderId } } },
            },
            dashapp_athlete_target_income: {
                create: { dashapp_income: { connect: { id: incomeId } } },
            },
            dashapp_athlete_key_markets_primary: {
                create: primaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: marketId } },
                })),
            },
            dashapp_athlete_key_markets_secondary: {
                create: secondaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: marketId } },
                })),
            },
            dashapp_athlete_key_markets_tertiary: {
                create: tertiaryIds?.map((tertiaryId) => ({
                    dashapp_states: { connect: { id: tertiaryId } },
                })),
            },
        },
    });

    res.status(STATUS_CODE.OK).send("Athlete created");
});

export const editAthlete = asyncHandler(async (req, res) => {
    const athleteId = req.params.id;

    if (!athleteId) {
        throw new BadRequestError("id not found");
    }

    const athleteExists = await prisma.dashapp_athlete.findUnique({
        where: { id: Number(athleteId) },
        select: { athlete_name: true },
    });

    if (!athleteExists?.athlete_name) {
        throw new NotFoundError();
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
        where: { id: Number(athleteId) },
        data: {
            athlete_name: athleteName,
            association: { connect: { id: associationId } },
            modified_by: { connect: { id: userId } },
            facebook: facebook ?? null,
            instagram: instagram ?? null,
            twitter: twitter ?? null,
            linkedin: linkedin ?? null,
            youtube: youtube ?? null,
            website: website ?? null,
            dashapp_agency: { connect: { id: agencyId } },
            dashapp_sport: { connect: { id: sportId } },
            nationality,
            dashapp_athlete_personality_traits: {
                deleteMany: {},
                create: subPersonalityTraitIds?.map((traitId) => ({
                    dashapp_subpersonality: {
                        connect: { id: traitId },
                    },
                })),
            },
            dashapp_athlete_target_age: {
                deleteMany: {},
                create: { dashapp_age: { connect: { id: ageId } } },
            },
            dashapp_athlete_target_gender: {
                deleteMany: {},
                create: { dashapp_gender: { connect: { id: genderId } } },
            },
            dashapp_athlete_target_income: {
                deleteMany: {},
                create: { dashapp_income: { connect: { id: incomeId } } },
            },
            dashapp_athlete_key_markets_primary: {
                deleteMany: {},
                create: primaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: marketId } },
                })),
            },
            dashapp_athlete_key_markets_secondary: {
                deleteMany: {},
                create: secondaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: marketId } },
                })),
            },
            dashapp_athlete_key_markets_tertiary: {
                deleteMany: {},
                create: tertiaryIds?.map((tertiaryId) => ({
                    dashapp_states: { connect: { id: tertiaryId } },
                })),
            },
        },
    });

    res.status(STATUS_CODE.OK).send("Athlete updated");
});

export const removeAthlete = asyncHandler(async (req, res) => {
    const athleteId = req.params.id;

    if (!athleteId) {
        throw new BadRequestError("id not found");
    }

    await prisma.dashapp_athlete.delete({
        where: { id: Number(athleteId) },
    });

    res.status(STATUS_CODE.OK).send("Athlete removed");
});
