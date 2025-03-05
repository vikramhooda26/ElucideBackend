import { prisma } from "../../db/index.js";

/* ----- Brand Helper Functions ----- */

export const getBrandsCount = async () => {
    return await prisma.dashapp_companydata.count();
};

export const getBrandsPerCategory = async () => {
    return await prisma.dashapp_category.findMany({
        select: {
            id: true,
            category: true,
            dashapp_subcategory: {
                select: {
                    id: true,
                    subcategory: true,
                    dashapp_companydata_subcategory: {
                        select: {
                            dashapp_companydata: {
                                select: {
                                    id: true,
                                    company_name: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            dashapp_companydata_subcategory: true,
                        },
                    },
                },
            },
        },
    });
};

export const getCategoriesCount = async () => {
    return await prisma.dashapp_category.count();
};

export const getRecentlyAddedBrands = async (take: number, skip: number) => {
    return await prisma.dashapp_companydata.findMany({
        select: {
            id: true,
            company_name: true,
            created_by: { select: { id: true, email: true } },
            modified_by: { select: { id: true, email: true } },
            created_date: true,
            modified_date: true,
        },
        orderBy: { created_date: "desc" },
        take,
        skip,
    });
};

export const getRecentlyModifiedBrands = async (take: number, skip: number) => {
    return await prisma.dashapp_companydata.findMany({
        select: {
            id: true,
            company_name: true,
            created_by: { select: { id: true, email: true } },
            modified_by: { select: { id: true, email: true } },
            created_date: true,
            modified_date: true,
        },
        orderBy: { modified_date: "desc" },
        take,
        skip,
    });
};

/* ----- Team Helper Functions ----- */

export const getTeamsCount = async () => {
    return await prisma.dashapp_team.count();
};

export const getNumberOfTeamsPerSport = async () => {
    return await prisma.dashapp_sport.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    dashapp_team: true,
                },
            },
        },
    });
};

export const getNumberOfTeamsPerState = async () => {
    return await prisma.dashapp_states.findMany({
        select: {
            id: true,
            state: true,
            _count: {
                select: {
                    dashapp_team: true,
                },
            },
        },
    });
};

export const getRecentlyAddedTeams = async (take: number, skip: number) => {
    return await prisma.dashapp_team.findMany({
        select: {
            id: true,
            team_name: true,
            created_by: { select: { id: true, email: true } },
            modified_by: { select: { id: true, email: true } },
            created_date: true,
            modified_date: true,
        },
        orderBy: { created_date: "desc" },
        take,
        skip,
    });
};

export const getRecentlyModifiedTeams = async (take: number, skip: number) => {
    return await prisma.dashapp_team.findMany({
        select: {
            id: true,
            team_name: true,
            created_by: { select: { id: true, email: true } },
            modified_by: { select: { id: true, email: true } },
            created_date: true,
            modified_date: true,
        },
        orderBy: { modified_date: "desc" },
        take,
        skip,
    });
};

/* ----- League Helper Functions ----- */

export const getLeaguesCount = async () => {
    return await prisma.dashapp_leagueinfo.count();
};

export const getNumberOfLeaguesPerSport = async () => {
    return await prisma.dashapp_sport.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    dashapp_leagueinfo: true,
                },
            },
        },
    });
};

export const getRecentlyAddedLeagues = async (take: number, skip: number) => {
    return await prisma.dashapp_leagueinfo.findMany({
        select: {
            id: true,
            property_name: true,
            created_by: { select: { id: true, email: true } },
            modified_by: { select: { id: true, email: true } },
            created_date: true,
            modified_date: true,
        },
        orderBy: { created_date: "desc" },
        take,
        skip,
    });
};

export const getRecentlyModifiedLeagues = async (take: number, skip: number) => {
    return await prisma.dashapp_leagueinfo.findMany({
        select: {
            id: true,
            property_name: true,
            created_by: { select: { id: true, email: true } },
            modified_by: { select: { id: true, email: true } },
            created_date: true,
            modified_date: true,
        },
        orderBy: { modified_date: "desc" },
        take,
        skip,
    });
};

/* ----- Athlete Helper Functions ----- */

export const getAthletesCount = async () => {
    return await prisma.dashapp_athlete.count();
};

export const getNumberOfAthletesPerSport = async () => {
    return await prisma.dashapp_sport.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    dashapp_athlete: true,
                },
            },
        },
    });
};

export const getRecentlyAddedAthletes = async (take: number, skip: number) => {
    return await prisma.dashapp_athlete.findMany({
        select: {
            id: true,
            athlete_name: true,
            created_by: { select: { id: true, email: true } },
            modified_by: { select: { id: true, email: true } },
            created_date: true,
            modified_date: true,
        },
        orderBy: { created_date: "desc" },
        take,
        skip,
    });
};

export const getRecentlyModifiedAthletes = async (take: number, skip: number) => {
    return await prisma.dashapp_athlete.findMany({
        select: {
            id: true,
            athlete_name: true,
            created_by: { select: { id: true, email: true } },
            modified_by: { select: { id: true, email: true } },
            created_date: true,
            modified_date: true,
        },
        orderBy: { modified_date: "desc" },
        take,
        skip,
    });
};
