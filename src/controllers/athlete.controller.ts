import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { prisma } from "../db/index.js";
import { STATUS_CODE } from "../lib/constants.js";

export const fetchAthleteByIdController = asyncHandler(async (req, res) => {
    const athleteId = req.params.id;

    if (!athleteId) {
        throw new BadRequestError("id not found");
    }

    const athlete = await prisma.dashapp_athlete.findUnique({
        where: { id: Number(athleteId) },
    });

    if (!athlete) {
        throw new NotFoundError();
    }

    res.status(STATUS_CODE.SUCCESS).json(athlete);
});

export const fetchAllAthletesController = asyncHandler(async (req, res) => {
    const athletes = await prisma.dashapp_athlete.findMany({
        select: { id: true, athlete_name: true },
        orderBy: { created_date: "desc" },
    });

    if (!athletes) {
        throw new NotFoundError();
    }

    res.status(STATUS_CODE.SUCCESS).json(athletes);
});

export const addAthleteController = asyncHandler(async (req, res) => {
    const { athleteName, age, associationId, createdById } = req.validatedData;
    await prisma.dashapp_athlete.create({
        data: {
            athlete_name: athleteName,
            age,
            association: { connect: { id: associationId } },
            // created_by: { connect: { id: createdById } },
        },
    });
});
