import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { STATUS_CODE } from "../lib/constants.js";
import { TCreateTeamSchema } from "../schemas/team.schema.js";

export const getAllTeams = asyncHandler(async (req, res) => {
    const teams = await prisma.dashapp_team.findMany({
        select: { id: true, team_name: true },
    });

    if (!teams) {
        throw new NotFoundError("No team found");
    }

    res.status(STATUS_CODE.OK).json(teams);
});

export const getTeamById = asyncHandler(async (req, res) => {
    const { teamId } = req.params;

    if (!teamId) {
        throw new BadRequestError("Team ID not found");
    }

    const team = await prisma.dashapp_team.findUnique({
        where: { id: Number(teamId) },
    });

    if (!team) {
        throw new NotFoundError("This team does not exists");
    }

    res.status(STATUS_CODE.OK).json(team);
});

export const createTeam = asyncHandler(async (req, res) => {
    const {
        teamName,
        sportId,
        leagueId,
        teamOwnerIds,
        yearOfInception,
        franchiseFee,
        hqCityId,
    } = req.validatedData as TCreateTeamSchema;

    await prisma.dashapp_team.create({
        data: {
            team_name: teamName,
            dashapp_sport: {
                connect: { id: sportId },
            },
            dashapp_leagueinfo: {
                connect: { id: leagueId },
            },
            dashapp_team_owner: {
                connect: teamOwnerIds?.map((teamOwnerId) => ({
                    id: teamOwnerId,
                })),
            },
            year_of_inception: yearOfInception,
            franchise_fee: franchiseFee,
            dashapp_hqcity: {
                connect: { id: hqCityId },
            },
        },
    });
});

export const editTeam = asyncHandler(async (req, res) => {});

export const removeTeam = asyncHandler(async (req, res) => {});

// TODO: Change leagueName to propertyName in leagueController
