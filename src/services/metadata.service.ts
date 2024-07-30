import { prisma } from "../db/index.js";

export const getAllAgeRanges = async () => {
    const ageRanges = await prisma.dashapp_age.findMany({
        select: { id: true, age_range: true },
    });

    return ageRanges;
};

export const getAllGenders = async () => {
    const genders = await prisma.dashapp_gender.findMany({
        select: { id: true, gender_is: true },
    });
    return genders;
};

export const getAllCities = async () => {
    const cities = await prisma.dashapp_hqcity.findMany({
        select: { id: true, name: true },
    });
    return cities;
};

export const getAllStates = async () => {
    const states = await prisma.dashapp_states.findMany({
        select: { id: true, state: true },
    });
    return states;
};

export const getAllActiveCampaigns = async () => {
    const activeCampaigns = await prisma.dashapp_activecampaigns.findMany({
        select: { id: true, name: true },
    });
    return activeCampaigns;
};

export const getAllAgencies = async () => {
    const agencies = await prisma.dashapp_agency.findMany({
        select: { id: true, name: true },
    });
    return agencies;
};

export const getAllAssets = async () => {
    const assets = await prisma.dashapp_assets.findMany({
        select: { id: true, asset: true },
    });
    return assets;
};

export const getAllBroadcastPartners = async () => {
    const broadcastPartners = await prisma.dashapp_broadcastpartner.findMany({
        select: { id: true, name: true },
    });
    return broadcastPartners;
};

export const getAllCategories = async () => {
    const categories = await prisma.dashapp_subcategory.findMany({
        select: { id: true, subcategory: true },
    });
    return categories;
};

export const getAllFormats = async () => {
    const formats = await prisma.dashapp_format.findMany({
        select: { id: true, format: true },
    });
    return formats;
};

export const getAllKeyMarkets = async () => {
    const keyMarketsList = await prisma.dashapp_keymarket.findMany({
        select: { id: true, zone: true },
    });
    return keyMarketsList;
};

export const getAllLeagues = async () => {
    const leagues = await prisma.dashapp_leagueinfo.findMany({
        select: { id: true, property_name: true },
    });
    return leagues;
};

export const getAllLeagueOwners = async () => {
    const leagueOwners = await prisma.dashapp_leagueinfo_owner.findMany({
        select: {
            id: true,
            dashapp_leagueowner: { select: { name: true } },
        },
    });
    return leagueOwners;
};

export const getAllMarketingPlatforms = async () => {
    const marketingPlatforms = await prisma.dashapp_marketingplatform.findMany({
        select: { id: true, platform: true },
    });
    return marketingPlatforms;
};

export const getAllNCCS = async () => {
    const nccsList = await prisma.dashapp_income.findMany({
        select: { id: true, income_class: true },
    });
    return nccsList;
};

export const getAllOTTPartners = async () => {
    const ottPartners = await prisma.dashapp_ottpartner.findMany({
        select: { id: true, name: true },
    });
    return ottPartners;
};

export const getAllParentOrgs = async () => {
    const parentOrgs = await prisma.dashapp_parentorg.findMany({
        select: { id: true, name: true },
    });
    return parentOrgs;
};

export const getAllPersonalityTraits = async () => {
    const personalityTraits = await prisma.dashapp_subpersonality.findMany({
        select: { id: true, name: true },
    });
    return personalityTraits;
};

export const getAllSportsDealSummaryLevels = async () => {
    const sportsDealSummaryLevels =
        await prisma.dashapp_sportsdealsummary.findMany({
            select: {
                id: true,
                dashapp_companydata: { select: { company_name: true } },
            },
        });
    return sportsDealSummaryLevels;
};

export const getAllSportsDealSummaryStatuses = async () => {
    const sportsDealSummaryStatuses =
        await prisma.dashapp_athlete_status.findMany({
            select: { id: true, status: true },
        });
    return sportsDealSummaryStatuses;
};

export const getAllSportsDealSummaryTerritories = async () => {
    const sportsDealSummaryTerritories =
        await prisma.dashapp_territory.findMany({
            select: { id: true, name: true },
        });
    return sportsDealSummaryTerritories;
};

export const getAllSportsDealSummaryTypes = async () => {
    const sportsDealSummaryTypes =
        await prisma.dashapp_activation_type.findMany({
            select: {
                id: true,
                dashapp_marketingplatform: {
                    select: { platform: true },
                },
            },
        });
    return sportsDealSummaryTypes;
};

export const getAllTaglines = async () => {
    const taglines = await prisma.dashapp_taglines.findMany({
        select: { id: true, name: true },
    });
    return taglines;
};

export const getAllTeamOwners = async () => {
    const teamOwners = await prisma.dashapp_teamowner.findMany({
        select: { id: true, name: true },
    });
    return teamOwners;
};

export const getAllTertiaries = async () => {
    const tertiaries = await getAllStates();
    return tertiaries;
};
