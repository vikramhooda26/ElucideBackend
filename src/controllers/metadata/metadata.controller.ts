import { Request, Response } from "express";
import { metadataStore } from "../../managers/MetadataManager.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { TGetAllMetadataSchema } from "../../schemas/metadata.schema.js";
import {
    getAllAgeRanges,
    getAllGenders,
    getAllCities,
    getAllStates,
    getAllActiveCampaigns,
    getAllAgencies,
    getAllAssets,
    getAllBroadcastPartners,
    getAllCategories,
    getAllFormats,
    getAllKeyMarkets,
    getAllLeagues,
    getAllLeagueOwners,
    getAllMarketingPlatforms,
    getAllNCCS,
    getAllOTTPartners,
    getAllParentOrgs,
    getAllPersonalityTraits,
    getAllSportsDealSummaryLevels,
    getAllSportsDealSummaryStatuses,
    getAllSportsDealSummaryTerritories,
    getAllSportsDealSummaryTypes,
    getAllTaglines,
    getAllTeamOwners,
    getAllTertiaries,
    getAllSports,
    getAllTiers,
    getAllAssociationLevels,
} from "../../services/metadata.service.js";
import asyncHandler from "express-async-handler";

export const fetchAllMetadata = async (req: Request, res: Response) => {
    const {
        age,
        sport,
        activeCampaign,
        agency,
        asset,
        broadcastPartner,
        category,
        city,
        format,
        gender,
        keyMarket,
        league,
        leagueOwner,
        marketingPlatform,
        nccs,
        ottPartner,
        parentOrg,
        personalityTrait,
        sportsDealSummaryLevel,
        sportsDealSummaryStatus,
        sportsDealSummaryTerritory,
        sportsDealSummaryType,
        state,
        tagline,
        teamOwner,
        tertiary,
        tier,
        associationLevel,
    } = req.validatedData as TGetAllMetadataSchema;

    try {
        const [
            ageRanges,
            genders,
            cities,
            states,
            activeCampaigns,
            agencies,
            assets,
            broadcastPartners,
            categories,
            formats,
            keyMarketsList,
            leagues,
            leagueOwners,
            marketingPlatforms,
            nccsList,
            ottPartners,
            parentOrgs,
            personalityTraits,
            sportsDealSummaryLevels,
            sportsDealSummaryStatuses,
            sportsDealSummaryTerritories,
            sportsDealSummaryTypes,
            taglines,
            teamOwners,
            tertiaries,
            sports,
            tiers,
            associationLevels,
        ] = await Promise.all([
            age ? getAllAgeRanges() : Promise.resolve(undefined),
            gender ? getAllGenders() : Promise.resolve(undefined),
            city ? getAllCities() : Promise.resolve(undefined),
            state ? getAllStates() : Promise.resolve(undefined),
            activeCampaign
                ? getAllActiveCampaigns()
                : Promise.resolve(undefined),
            agency ? getAllAgencies() : Promise.resolve(undefined),
            asset ? getAllAssets() : Promise.resolve(undefined),
            broadcastPartner
                ? getAllBroadcastPartners()
                : Promise.resolve(undefined),
            category ? getAllCategories() : Promise.resolve(undefined),
            format ? getAllFormats() : Promise.resolve(undefined),
            keyMarket ? getAllKeyMarkets() : Promise.resolve(undefined),
            league ? getAllLeagues() : Promise.resolve(undefined),
            leagueOwner ? getAllLeagueOwners() : Promise.resolve(undefined),
            marketingPlatform
                ? getAllMarketingPlatforms()
                : Promise.resolve(undefined),
            nccs ? getAllNCCS() : Promise.resolve(undefined),
            ottPartner ? getAllOTTPartners() : Promise.resolve(undefined),
            parentOrg ? getAllParentOrgs() : Promise.resolve(undefined),
            personalityTrait
                ? getAllPersonalityTraits()
                : Promise.resolve(undefined),
            sportsDealSummaryLevel
                ? getAllSportsDealSummaryLevels()
                : Promise.resolve(undefined),
            sportsDealSummaryStatus
                ? getAllSportsDealSummaryStatuses()
                : Promise.resolve(undefined),
            sportsDealSummaryTerritory
                ? getAllSportsDealSummaryTerritories()
                : Promise.resolve(undefined),
            sportsDealSummaryType
                ? getAllSportsDealSummaryTypes()
                : Promise.resolve(undefined),
            tagline ? getAllTaglines() : Promise.resolve(undefined),
            teamOwner ? getAllTeamOwners() : Promise.resolve(undefined),
            tertiary ? getAllTertiaries() : Promise.resolve(undefined),
            sport ? getAllSports() : Promise.resolve(undefined),
            tier ? getAllTiers() : Promise.resolve(undefined),
            associationLevel
                ? getAllAssociationLevels()
                : Promise.resolve(undefined),
        ]);

        Object.values(METADATA_KEYS).forEach((key) => {
            if (req.validatedData[key as keyof TGetAllMetadataSchema]) {
                metadataStore.setHasUpdated(key, false);
            }
        });

        res.status(STATUS_CODE.OK).json({
            age: ageRanges,
            gender: genders,
            city: cities,
            state: states,
            activeCampaign: activeCampaigns,
            agency: agencies,
            asset: assets,
            broadcastPartner: broadcastPartners,
            category: categories,
            format: formats,
            keyMarket: keyMarketsList,
            league: leagues,
            leagueOwner: leagueOwners,
            marketingPlatform: marketingPlatforms,
            nccs: nccsList,
            ottPartner: ottPartners,
            parentOrg: parentOrgs,
            personalityTrait: personalityTraits,
            sportsDealSummaryLevel: sportsDealSummaryLevels,
            sportsDealSummaryStatus: sportsDealSummaryStatuses,
            sportsDealSummaryTerritory: sportsDealSummaryTerritories,
            sportsDealSummaryType: sportsDealSummaryTypes,
            tagline: taglines,
            teamOwner: teamOwners,
            tertiary: tertiaries,
            sport: sports,
            tier: tiers,
            associationLevel: associationLevels,
        });
    } catch (error) {
        console.error("Error fetching metadata:", error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            error: "Failed to fetch metadata",
        });
    }
};

export const fetchMetadataHasUpdated = asyncHandler((req, res) => {
    const hasUpdatedRecords = metadataStore.getAllRecords();

    res.status(STATUS_CODE.OK).json(hasUpdatedRecords);
});
