import { prisma } from "../db/index.js";

export const getAllAgeRanges = async () => {
    const ageRanges = await prisma.dashapp_age.findMany({
        select: { id: true, age_range: true },
    });

    return ageRanges.map((ageRange) => ({
        value: ageRange.id,
        label: ageRange.age_range,
    }));
};

export const getAllGenders = async () => {
    const genders = await prisma.dashapp_gender.findMany({
        select: { id: true, gender_is: true },
    });
    return genders.map((gender) => ({
        value: gender.id,
        label: gender.gender_is,
    }));
};

export const getAllCities = async () => {
    const cities = await prisma.dashapp_hqcity.findMany({
        select: { id: true, name: true },
    });
    return cities.map((city) => ({
        value: city.id,
        label: city.name,
    }));
};

export const getAllStates = async () => {
    const states = await prisma.dashapp_states.findMany({
        select: { id: true, state: true },
    });
    return states.map((state) => ({
        value: state.id,
        label: state.state,
    }));
};

export const getAllActiveCampaigns = async () => {
    const activeCampaigns = await prisma.dashapp_activecampaigns.findMany({
        select: { id: true, name: true },
    });
    return activeCampaigns.map((campaign) => ({
        value: campaign.id,
        label: campaign.name,
    }));
};

export const getAllAgencies = async () => {
    const agencies = await prisma.dashapp_agency.findMany({
        select: { id: true, name: true },
    });
    return agencies.map((agency) => ({
        value: agency.id,
        label: agency.name,
    }));
};

export const getAllAssets = async () => {
    const assets = await prisma.dashapp_assets.findMany({
        select: { id: true, asset: true },
    });
    return assets.map((asset) => ({
        value: asset.id,
        label: asset.asset,
    }));
};

export const getAllBroadcastPartners = async () => {
    const broadcastPartners = await prisma.dashapp_broadcastpartner.findMany({
        select: { id: true, name: true },
    });
    return broadcastPartners.map((partner) => ({
        value: partner.id,
        label: partner.name,
    }));
};

export const getAllCategories = async () => {
    const categories = await prisma.dashapp_subcategory.findMany({
        select: { id: true, subcategory: true },
    });
    return categories.map((category) => ({
        value: category.id,
        label: category.subcategory,
    }));
};

export const getAllFormats = async () => {
    const formats = await prisma.dashapp_format.findMany({
        select: { id: true, format: true },
    });
    return formats.map((format) => ({
        value: format.id,
        label: format.format,
    }));
};

export const getAllKeyMarkets = async () => {
    const keyMarketsList = await prisma.dashapp_keymarket.findMany({
        select: { id: true, zone: true },
    });
    return keyMarketsList.map((market) => ({
        value: market.id,
        label: market.zone,
    }));
};

export const getAllLeagues = async () => {
    const leagues = await prisma.dashapp_leagueinfo.findMany({
        select: { id: true, property_name: true },
    });
    return leagues.map((league) => ({
        value: league.id,
        label: league.property_name,
    }));
};

export const getAllLeagueOwners = async () => {
    const leagueOwners = await prisma.dashapp_leagueinfo_owner.findMany({
        select: {
            id: true,
            dashapp_leagueowner: { select: { name: true } },
        },
    });
    return leagueOwners.map((owner) => ({
        value: owner.id,
        label: owner.dashapp_leagueowner.name,
    }));
};

export const getAllMarketingPlatforms = async () => {
    const marketingPlatforms = await prisma.dashapp_marketingplatform.findMany({
        select: { id: true, platform: true },
    });
    return marketingPlatforms.map((platform) => ({
        value: platform.id,
        label: platform.platform,
    }));
};

export const getAllNCCS = async () => {
    const nccsList = await prisma.dashapp_nccs.findMany({
        select: { id: true, nccs_class: true },
    });
    return nccsList.map((nccs) => ({
        value: nccs.id,
        label: nccs.nccs_class,
    }));
};

export const getAllOTTPartners = async () => {
    const ottPartners = await prisma.dashapp_ottpartner.findMany({
        select: { id: true, name: true },
    });
    return ottPartners.map((partner) => ({
        value: partner.id,
        label: partner.name,
    }));
};

export const getAllParentOrgs = async () => {
    const parentOrgs = await prisma.dashapp_parentorg.findMany({
        select: { id: true, name: true },
    });
    return parentOrgs.map((org) => ({
        value: org.id,
        label: org.name,
    }));
};

export const getAllPersonalityTraits = async () => {
    const personalityTraits = await prisma.dashapp_subpersonality.findMany({
        select: { id: true, name: true },
    });
    return personalityTraits.map((trait) => ({
        value: trait.id,
        label: trait.name,
    }));
};

export const getAllSportsDealSummaryLevels = async () => {
    const sportsDealSummaryLevels =
        await prisma.dashapp_sportsdealsummary.findMany({
            select: {
                id: true,
                dashapp_level: { select: { name: true } },
            },
        });

    return sportsDealSummaryLevels.map((level) => ({
        value: level.id,
        label: level.dashapp_level?.name,
    }));
};

export const getAllSportsDealSummaryStatuses = async () => {
    const sportsDealSummaryStatuses =
        await prisma.dashapp_athlete_status.findMany({
            select: { id: true, status: true },
        });
    return sportsDealSummaryStatuses.map((status) => ({
        value: status.id,
        label: status.status,
    }));
};

export const getAllSportsDealSummaryTerritories = async () => {
    const sportsDealSummaryTerritories =
        await prisma.dashapp_territory.findMany({
            select: { id: true, name: true },
        });
    return sportsDealSummaryTerritories.map((territory) => ({
        value: territory.id,
        label: territory.name,
    }));
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
    return sportsDealSummaryTypes.map((type) => ({
        value: type.id,
        label: type.dashapp_marketingplatform.platform,
    }));
};

export const getAllTaglines = async () => {
    const taglines = await prisma.dashapp_taglines.findMany({
        select: { id: true, name: true },
    });
    return taglines.map((tagline) => ({
        value: tagline.id,
        label: tagline.name,
    }));
};

export const getAllTeamOwners = async () => {
    const teamOwners = await prisma.dashapp_teamowner.findMany({
        select: { id: true, name: true },
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
    });

    return sports.map((sport) => ({ value: sport.id, label: sport.name }));
};

export const getAllTiers = async () => {
    const tiers = await prisma.dashapp_tier.findMany({
        select: { id: true, name: true },
    });

    return tiers.map((tier) => ({ value: tier.id, label: tier.name }));
};

export const getAllAssociationLevels = async () => {
    const associationLevels = await prisma.association_level.findMany({
        select: {
            id: true,
            name: true,
        },
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
    });

    return nationalities.map((nationality) => ({
        value: nationality.id,
        label: nationality.name,
    }));
};

export const getAllSocialMedia = async () => {
    const socialMediaplatforms =
        await prisma.dashapp_socialmedia_platform.findMany({
            select: { id: true, name: true },
        });

    return socialMediaplatforms.map((platform) => ({
        value: platform.id,
        label: platform.name,
    }));
};

export const getAllStatus = async () => {
    const status = await prisma.dashapp_athlete_status.findMany({
        select: { id: true, status: true },
    });

    return status.map((status) => ({
        value: status.id,
        label: status.status,
    }));
};
