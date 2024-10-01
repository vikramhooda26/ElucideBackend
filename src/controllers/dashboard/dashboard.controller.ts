import asyncHandler from "express-async-handler";
import {
    getAthletesCount,
    getBrandsCount,
    getLeaguesCount,
    getNumberOfAthletesPerSport,
    getNumberOfLeaguesPerSport,
    getNumberOfTeamsPerState,
    getNumberOfTeamsPerSport,
    getRecentlyAddedAthletes,
    getRecentlyAddedLeagues,
    getRecentlyModifiedAthletes,
    getRecentlyModifiedLeagues,
    getTeamsCount,
    getRecentlyAddedTeams,
    getRecentlyModifiedTeams,
    getCategoriesCount,
    getRecentlyAddedBrands,
    getRecentlyModifiedBrands,
} from "./helpers.js";
import { STATUS_CODE } from "../../lib/constants.js";
/**
 *
 * @todo
 *
 * 1. Add recently modified and recently added data by creating a new table in the database or using the old table
 */

export const fetchAllMetrics = asyncHandler(async (req, res) => {
    const [brandsCount, athletesCount, teamsCount, leaguesCount] = await Promise.all([
        getBrandsCount(),
        getAthletesCount(),
        getTeamsCount(),
        getLeaguesCount(),
    ]);

    res.status(STATUS_CODE.OK).json({
        brandsCount,
        athletesCount,
        teamsCount,
        leaguesCount,
    });
});

export const fetchAthletesMetrics = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const convertedTake = Number.isNaN(Number(take)) ? 50 : Number(take);
    const convertedSkip = Number.isNaN(Number(skip)) ? 0 : Number(skip);

    const [athletesCount, numberOfAthletesPerSport, recentlyAddedAthletes, recentlyModifiedAthletes] =
        await Promise.all([
            getAthletesCount(),
            getNumberOfAthletesPerSport(),
            getRecentlyAddedAthletes(convertedTake, convertedSkip),
            getRecentlyModifiedAthletes(convertedTake, convertedSkip),
        ]);

    res.status(STATUS_CODE.OK).json({
        athletesCount,
        numberOfAthletesPerSport,
        recentlyAddedAthletes: recentlyAddedAthletes.map((data) => ({
            id: data.id,
            name: data.athlete_name,
            createdBy: data.created_by,
            modifiedBy: data.modified_by,
            createdAt: data.created_date,
            modifiedAt: data.modified_date,
        })),
        recentlyModifiedAthletes: recentlyModifiedAthletes.map((data) => ({
            id: data.id,
            name: data.athlete_name,
            createdBy: data.created_by,
            modifiedBy: data.modified_by,
            createdAt: data.created_date,
            modifiedAt: data.modified_date,
        })),
    });
});

export const fetchLeaguesMetrics = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const convertedTake = Number.isNaN(Number(take)) ? 50 : Number(take);
    const convertedSkip = Number.isNaN(Number(skip)) ? 0 : Number(skip);

    const [leaguesCount, numberOfLeaguesPerSport, recentlyAddedLeagues, recentlyModifiedLeagues] = await Promise.all([
        getLeaguesCount(),
        getNumberOfLeaguesPerSport(),
        getRecentlyAddedLeagues(convertedTake, convertedSkip),
        getRecentlyModifiedLeagues(convertedTake, convertedSkip),
    ]);

    res.status(STATUS_CODE.OK).json({
        leaguesCount,
        numberOfLeaguesPerSport,
        recentlyAddedLeagues: recentlyAddedLeagues.map((data) => ({
            id: data.id,
            name: data.property_name,
            createdBy: data.created_by,
            modifiedBy: data.modified_by,
            createdAt: data.created_date,
            modifiedAt: data.modified_date,
        })),
        recentlyModifiedLeagues: recentlyModifiedLeagues.map((data) => ({
            id: data.id,
            name: data.property_name,
            createdBy: data.created_by,
            modifiedBy: data.modified_by,
            createdAt: data.created_date,
            modifiedAt: data.modified_date,
        })),
    });
});

export const fetchTeamsMetrics = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const convertedTake = Number.isNaN(Number(take)) ? 50 : Number(take);
    const convertedSkip = Number.isNaN(Number(skip)) ? 0 : Number(skip);

    const [teamsCount, numberOfTeamsPerSport, numberOfTeamsPerState, recentlyAddedTeams, recentlyModifiedTeams] =
        await Promise.all([
            getTeamsCount(),
            getNumberOfTeamsPerSport(),
            getNumberOfTeamsPerState(),
            getRecentlyAddedTeams(convertedTake, convertedSkip),
            getRecentlyModifiedTeams(convertedTake, convertedSkip),
        ]);

    res.status(STATUS_CODE.OK).json({
        teamsCount,
        numberOfTeamsPerSport,
        numberOfTeamsPerState,
        recentlyAddedTeams: recentlyAddedTeams.map((data) => ({
            id: data.id,
            name: data.team_name,
            createdBy: data.created_by,
            modifiedBy: data.modified_by,
            createdAt: data.created_date,
            modifiedAt: data.modified_date,
        })),
        recentlyModifiedTeams: recentlyModifiedTeams.map((data) => ({
            id: data.id,
            name: data.team_name,
            createdBy: data.created_by,
            modifiedBy: data.modified_by,
            createdAt: data.created_date,
            modifiedAt: data.modified_date,
        })),
    });
});

export const fetchBrandsMetrics = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const convertedTake = Number.isNaN(Number(take)) ? 50 : Number(take);
    const convertedSkip = Number.isNaN(Number(skip)) ? 0 : Number(skip);

    const [brandsCount, categoriesCount, recentlyAddedBrands, recentlyModifiedBrands] = await Promise.all([
        getBrandsCount(),
        getCategoriesCount(),
        getRecentlyAddedBrands(convertedTake, convertedSkip),
        getRecentlyModifiedBrands(convertedTake, convertedSkip),
    ]);

    res.status(STATUS_CODE.OK).json({
        brandsCount,
        categoriesCount,
        recentlyAddedBrands: recentlyAddedBrands.map((data) => ({
            id: data.id,
            name: data.company_name,
            createdBy: data.created_by,
            modifiedBy: data.modified_by,
            createdAt: data.created_date,
            modifiedAt: data.modified_date,
        })),
        recentlyModifiedBrands: recentlyModifiedBrands.map((data) => ({
            id: data.id,
            name: data.company_name,
            createdBy: data.created_by,
            modifiedBy: data.modified_by,
            createdAt: data.created_date,
            modifiedAt: data.modified_date,
        })),
    });
});
