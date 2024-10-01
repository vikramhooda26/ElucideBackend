import { prisma } from "../db/index.js";

export const getAllAgeRanges = async () => {
    const ageRanges = await prisma.dashapp_age.findMany({
        select: { id: true, age_range: true },
        orderBy: { age_range: "asc" },
    });

    return ageRanges.map((ageRange) => ({
        value: ageRange.id,
        label: ageRange.age_range,
    }));
};

export const getAllGenders = async () => {
    const genders = await prisma.dashapp_gender.findMany({
        select: { id: true, gender_is: true },
        orderBy: { gender_is: "asc" },
    });
    return genders.map((gender) => ({
        value: gender.id,
        label: gender.gender_is,
    }));
};

export const getAllCities = async () => {
    const cities = await prisma.dashapp_hqcity.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
    return cities.map((city) => ({
        value: city.id,
        label: city.name,
    }));
};

export const getAllStates = async () => {
    const states = await prisma.dashapp_states.findMany({
        select: { id: true, state: true },
        orderBy: { state: "asc" },
    });
    return states.map((state) => ({
        value: state.id,
        label: state.state,
    }));
};

export const getAllActiveCampaigns = async () => {
    const activeCampaigns = await prisma.dashapp_activecampaigns.findMany({
        select: { id: true, name: true },
        orderBy: { created_date: "desc" },
    });
    return activeCampaigns.map((campaign) => ({
        value: campaign.id,
        label: campaign.name,
    }));
};

export const getAllAgencies = async () => {
    const agencies = await prisma.dashapp_agency.findMany({
        select: { id: true, name: true },
        orderBy: { created_date: "desc" },
    });
    return agencies.map((agency) => ({
        value: agency.id,
        label: agency.name,
    }));
};

export const getAllAssets = async () => {
    const assets = await prisma.dashapp_assets.findMany({
        select: { id: true, asset: true },
        orderBy: { created_date: "desc" },
    });
    return assets.map((asset) => ({
        value: asset.id,
        label: asset.asset,
    }));
};

export const getAllBroadcastPartners = async () => {
    const broadcastPartners = await prisma.dashapp_broadcastpartner.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
    return broadcastPartners.map((partner) => ({
        value: partner.id,
        label: partner.name,
    }));
};

export const getAllCategories = async () => {
    const categories = await prisma.dashapp_subcategory.findMany({
        select: { id: true, subcategory: true },
        orderBy: { created_date: "desc" },
    });
    return categories.map((category) => ({
        value: category.id,
        label: category.subcategory,
    }));
};

export const getAllFormats = async () => {
    const formats = await prisma.dashapp_format.findMany({
        select: { id: true, format: true },
        orderBy: { format: "asc" },
    });
    return formats.map((format) => ({
        value: format.id,
        label: format.format,
    }));
};

export const getAllKeyMarkets = async () => {
    const keyMarketsList = await prisma.dashapp_keymarket.findMany({
        select: { id: true, zone: true },
        orderBy: { zone: "asc" },
    });
    return keyMarketsList.map((market) => ({
        value: market.id,
        label: market.zone,
    }));
};

export const getAllLeagues = async () => {
    const leagues = await prisma.dashapp_leagueinfo.findMany({
        select: { id: true, property_name: true },
        orderBy: { created_date: "desc" },
    });
    return leagues.map((league) => ({
        value: league.id,
        label: league.property_name,
    }));
};

export const getAllLeagueOwners = async () => {
    const leagueOwners = await prisma.dashapp_leagueowner.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: { name: "asc" },
    });
    return leagueOwners.map((owner) => ({
        value: owner.id,
        label: owner.name,
    }));
};

export const getAllMarketingPlatforms = async () => {
    const marketingPlatforms = await prisma.dashapp_marketingplatform.findMany({
        select: { id: true, platform: true },
        orderBy: { platform: "asc" },
    });
    return marketingPlatforms.map((platform) => ({
        value: platform.id,
        label: platform.platform,
    }));
};

export const getAllNCCS = async () => {
    const nccsList = await prisma.dashapp_nccs.findMany({
        select: { id: true, nccs_class: true },
        orderBy: { nccs_class: "asc" },
    });
    return nccsList.map((nccs) => ({
        value: nccs.id,
        label: nccs.nccs_class,
    }));
};

export const getAllOTTPartners = async () => {
    const ottPartners = await prisma.dashapp_ottpartner.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
    return ottPartners.map((partner) => ({
        value: partner.id,
        label: partner.name,
    }));
};

export const getAllParentOrgs = async () => {
    const parentOrgs = await prisma.dashapp_parentorg.findMany({
        select: { id: true, name: true },
        orderBy: { created_date: "desc" },
    });
    return parentOrgs.map((org) => ({
        value: org.id,
        label: org.name,
    }));
};

export const getAllPersonalityTraits = async () => {
    const personalityTraits = await prisma.dashapp_subpersonality.findMany({
        select: { id: true, name: true },
        orderBy: { created_date: "desc" },
    });
    return personalityTraits.map((trait) => ({
        value: trait.id,
        label: trait.name,
    }));
};

export const getAllSportsDealSummaryLevels = async () => {
    const sportsDealSummaryLevels = await prisma.dashapp_level.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: { created_date: "desc" },
    });

    return sportsDealSummaryLevels.map((level) => ({
        value: level.id,
        label: level.name,
    }));
};

export const getAllSportsDealSummaryStatuses = async () => {
    const sportsDealSummaryStatuses = await prisma.dashapp_athlete_status.findMany({
        select: { id: true, status: true },
        orderBy: { status: "asc" },
    });
    return sportsDealSummaryStatuses.map((status) => ({
        value: status.id,
        label: status.status,
    }));
};

export const getAllSportsDealSummaryTerritories = async () => {
    const sportsDealSummaryTerritories = await prisma.dashapp_territory.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
    return sportsDealSummaryTerritories.map((territory) => ({
        value: territory.id,
        label: territory.name,
    }));
};

export const getAllSportsDealSummaryTypes = async () => {
    const sportsDealSummaryTypes = await prisma.dashapp_marketingplatform.findMany({
        select: {
            id: true,
            platform: true,
        },
        orderBy: { platform: "asc" },
    });
    return sportsDealSummaryTypes.map((type) => ({
        value: type.id,
        label: type.platform,
    }));
};

export const getAllTaglines = async () => {
    const taglines = await prisma.dashapp_taglines.findMany({
        select: { id: true, name: true },
        orderBy: { created_date: "desc" },
    });
    return taglines.map((tagline) => ({
        value: tagline.id,
        label: tagline.name,
    }));
};

export const getAllTeamOwners = async () => {
    const teamOwners = await prisma.dashapp_teamowner.findMany({
        select: { id: true, name: true },
        orderBy: { created_date: "desc" },
    });
    return teamOwners.map((owner) => ({
        value: owner.id,
        label: owner.name,
    }));
};

export const getAllTertiaries = async () => {
    const tertiaries = await getAllStates();
    return tertiaries;
};

export const getAllSports = async () => {
    const sports = await prisma.dashapp_sport.findMany({
        select: { id: true, name: true },
        orderBy: { created_date: "desc" },
    });

    return sports.map((sport) => ({ value: sport.id, label: sport.name }));
};

export const getAllTiers = async () => {
    const tiers = await prisma.dashapp_tier.findMany({
        select: { id: true, name: true },
        orderBy: { id: "asc" },
    });

    return tiers.map((tier) => ({ value: tier.id, label: tier.name }));
};

export const getAllAssociationLevels = async () => {
    const associationLevels = await prisma.association_level.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: { created_date: "desc" },
    });

    return associationLevels.map((associationLevel) => ({
        value: associationLevel?.id,
        label: associationLevel?.name,
    }));
};

export const getAllNationalities = async () => {
    const nationalities = await prisma.dashapp_countries.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: { name: "asc" },
    });

    return nationalities.map((nationality) => ({
        value: nationality.id,
        label: nationality.name,
    }));
};

export const getAllSocialMedia = async () => {
    const socialMediaplatforms = await prisma.dashapp_socialmedia_platform.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });

    return socialMediaplatforms.map((platform) => ({
        value: platform.id,
        label: platform.name,
    }));
};

export const getAllStatus = async () => {
    const status = await prisma.dashapp_athlete_status.findMany({
        select: { id: true, status: true },
        orderBy: { created_date: "desc" },
    });

    return status.map((status) => ({
        value: status.id,
        label: status.status,
    }));
};

export const getAllBrands = async () => {
    const brand = await prisma.dashapp_companydata.findMany({
        select: { id: true, company_name: true },
        orderBy: { created_date: "desc" },
    });

    return brand.map((v) => ({
        value: v.id,
        label: v.company_name,
    }));
};

export const getAllTeams = async () => {
    const team = await prisma.dashapp_team.findMany({
        select: { id: true, team_name: true },
        orderBy: { created_date: "desc" },
    });

    return team.map((v) => ({ value: v.id, label: v.team_name }));
};

export const getAllAthletes = async () => {
    const athlete = await prisma.dashapp_athlete.findMany({
        select: { id: true, athlete_name: true },
        orderBy: { created_date: "desc" },
    });

    return athlete.map((v) => ({ value: v.id, label: v.athlete_name }));
};

export const getAllMaincategories = async () => {
    const maincategories = await prisma.dashapp_category.findMany({
        select: { id: true, category: true },
        orderBy: { created_date: "desc" },
    });

    return maincategories.map((category) => ({
        value: category.id,
        label: category.category,
    }));
};

export const getAllMainPersonalities = async () => {
    const mainpersonalities = await prisma.dashapp_mainpersonality.findMany({
        select: { id: true, name: true },
        orderBy: { created_date: "desc" },
    });

    return mainpersonalities.map((personality) => ({
        value: personality.id,
        label: personality.name,
    }));
};
