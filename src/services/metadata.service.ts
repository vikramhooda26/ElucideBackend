import e from "express";
import { prisma } from "../db/index.js";

export const getAllAgeRanges = async () => {
    const ageRanges = await prisma.dashapp_age.findMany({
        select: { id: true, age_range: true },
    });

    return ageRanges.map((ageRange) => ({
        id: ageRange.id,
        range: ageRange.age_range,
    }));
};

export const getAllGenders = async () => {
    const genders = await prisma.dashapp_gender.findMany({
        select: { id: true, gender_is: true },
    });
    return genders.map((gender) => ({
        id: gender.id,
        gender: gender.gender_is,
    }));
};

export const getAllCities = async () => {
    const cities = await prisma.dashapp_hqcity.findMany({
        select: { id: true, name: true },
    });
    return cities.map((city) => ({
        id: city.id,
        name: city.name,
    }));
};

export const getAllStates = async () => {
    const states = await prisma.dashapp_states.findMany({
        select: { id: true, state: true },
    });
    return states.map((state) => ({
        id: state.id,
        name: state.state,
    }));
};

export const getAllActiveCampaigns = async () => {
    const activeCampaigns = await prisma.dashapp_activecampaigns.findMany({
        select: { id: true, name: true },
    });
    return activeCampaigns.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
    }));
};

export const getAllAgencies = async () => {
    const agencies = await prisma.dashapp_agency.findMany({
        select: { id: true, name: true },
    });
    return agencies.map((agency) => ({
        id: agency.id,
        name: agency.name,
    }));
};

export const getAllAssets = async () => {
    const assets = await prisma.dashapp_assets.findMany({
        select: { id: true, asset: true },
    });
    return assets.map((asset) => ({
        id: asset.id,
        name: asset.asset,
    }));
};

export const getAllBroadcastPartners = async () => {
    const broadcastPartners = await prisma.dashapp_broadcastpartner.findMany({
        select: { id: true, name: true },
    });
    return broadcastPartners.map((partner) => ({
        id: partner.id,
        name: partner.name,
    }));
};

export const getAllCategories = async () => {
    const categories = await prisma.dashapp_subcategory.findMany({
        select: { id: true, subcategory: true },
    });
    return categories.map((category) => ({
        id: category.id,
        name: category.subcategory,
    }));
};

export const getAllFormats = async () => {
    const formats = await prisma.dashapp_format.findMany({
        select: { id: true, format: true },
    });
    return formats.map((format) => ({
        id: format.id,
        format: format.format,
    }));
};

export const getAllKeyMarkets = async () => {
    const keyMarketsList = await prisma.dashapp_keymarket.findMany({
        select: { id: true, zone: true },
    });
    return keyMarketsList.map((market) => ({
        id: market.id,
        zone: market.zone,
    }));
};

export const getAllLeagues = async () => {
    const leagues = await prisma.dashapp_leagueinfo.findMany({
        select: { id: true, property_name: true },
    });
    return leagues.map((league) => ({
        id: league.id,
        name: league.property_name,
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
        id: owner.id,
        name: owner.dashapp_leagueowner.name,
    }));
};

export const getAllMarketingPlatforms = async () => {
    const marketingPlatforms = await prisma.dashapp_marketingplatform.findMany({
        select: { id: true, platform: true },
    });
    return marketingPlatforms.map((platform) => ({
        id: platform.id,
        name: platform.platform,
    }));
};

export const getAllNCCS = async () => {
    const nccsList = await prisma.dashapp_nccs.findMany({
        select: { id: true, nccs_class: true },
    });
    return nccsList.map((nccs) => ({
        id: nccs.id,
        class: nccs.nccs_class,
    }));
};

export const getAllOTTPartners = async () => {
    const ottPartners = await prisma.dashapp_ottpartner.findMany({
        select: { id: true, name: true },
    });
    return ottPartners.map((partner) => ({
        id: partner.id,
        name: partner.name,
    }));
};

export const getAllParentOrgs = async () => {
    const parentOrgs = await prisma.dashapp_parentorg.findMany({
        select: { id: true, name: true },
    });
    return parentOrgs.map((org) => ({
        id: org.id,
        name: org.name,
    }));
};

export const getAllPersonalityTraits = async () => {
    const personalityTraits = await prisma.dashapp_subpersonality.findMany({
        select: { id: true, name: true },
    });
    return personalityTraits.map((trait) => ({
        id: trait.id,
        name: trait.name,
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
        id: level.id,
        name: level.dashapp_level?.name,
    }));
};

export const getAllSportsDealSummaryStatuses = async () => {
    const sportsDealSummaryStatuses =
        await prisma.dashapp_athlete_status.findMany({
            select: { id: true, status: true },
        });
    return sportsDealSummaryStatuses.map((status) => ({
        id: status.id,
        status: status.status,
    }));
};

export const getAllSportsDealSummaryTerritories = async () => {
    const sportsDealSummaryTerritories =
        await prisma.dashapp_territory.findMany({
            select: { id: true, name: true },
        });
    return sportsDealSummaryTerritories.map((territory) => ({
        id: territory.id,
        name: territory.name,
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
        id: type.id,
        name: type.dashapp_marketingplatform.platform,
    }));
};

export const getAllTaglines = async () => {
    const taglines = await prisma.dashapp_taglines.findMany({
        select: { id: true, name: true },
    });
    return taglines.map((tagline) => ({
        id: tagline.id,
        name: tagline.name,
    }));
};

export const getAllTeamOwners = async () => {
    const teamOwners = await prisma.dashapp_teamowner.findMany({
        select: { id: true, name: true },
    });
    return teamOwners.map((owner) => ({
        id: owner.id,
        name: owner.name,
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

    return sports.map((sport) => ({ id: sport.id, name: sport.name }));
};

export const getAllTiers = async () => {
    const tiers = await prisma.dashapp_tier.findMany({
        select: { id: true, name: true },
    });

    return tiers.map((tier) => ({ id: tier.id, name: tier.name }));
};

export const getAllAssociationLevels = async () => {
    const associationLevels = await prisma.association.findMany({
        select: {
            association_level: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return associationLevels.map((associationLevel) => ({
        id: associationLevel.association_level?.id,
        name: associationLevel.association_level?.name,
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
        id: nationality.id,
        nationality: nationality.name,
    }));
};
export const getAllSocialMedia = async () => {
    const socialMediaplatforms =
        await prisma.dashapp_socialmedia_platform.findMany({
            select: { id: true, name: true },
        });

    return socialMediaplatforms.map((platform) => ({
        id: platform.id,
        name: platform.name,
    }));
};
