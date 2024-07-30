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
        keyMarkets,
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
            age ? getAllAgeRanges() : Promise.resolve([]),
            gender ? getAllGenders() : Promise.resolve([]),
            city ? getAllCities() : Promise.resolve([]),
            state ? getAllStates() : Promise.resolve([]),
            activeCampaign ? getAllActiveCampaigns() : Promise.resolve([]),
            agency ? getAllAgencies() : Promise.resolve([]),
            asset ? getAllAssets() : Promise.resolve([]),
            broadcastPartner ? getAllBroadcastPartners() : Promise.resolve([]),
            category ? getAllCategories() : Promise.resolve([]),
            format ? getAllFormats() : Promise.resolve([]),
            keyMarkets ? getAllKeyMarkets() : Promise.resolve([]),
            league ? getAllLeagues() : Promise.resolve([]),
            leagueOwner ? getAllLeagueOwners() : Promise.resolve([]),
            marketingPlatform
                ? getAllMarketingPlatforms()
                : Promise.resolve([]),
            nccs ? getAllNCCS() : Promise.resolve([]),
            ottPartner ? getAllOTTPartners() : Promise.resolve([]),
            parentOrg ? getAllParentOrgs() : Promise.resolve([]),
            personalityTrait ? getAllPersonalityTraits() : Promise.resolve([]),
            sportsDealSummaryLevel
                ? getAllSportsDealSummaryLevels()
                : Promise.resolve([]),
            sportsDealSummaryStatus
                ? getAllSportsDealSummaryStatuses()
                : Promise.resolve([]),
            sportsDealSummaryTerritory
                ? getAllSportsDealSummaryTerritories()
                : Promise.resolve([]),
            sportsDealSummaryType
                ? getAllSportsDealSummaryTypes()
                : Promise.resolve([]),
            tagline ? getAllTaglines() : Promise.resolve([]),
            teamOwner ? getAllTeamOwners() : Promise.resolve([]),
            tertiary ? getAllTertiaries() : Promise.resolve([]),
            sport ? getAllSports() : Promise.resolve([]),
            tier ? getAllTiers() : Promise.resolve([]),
            associationLevel ? getAllAssociationLevels() : Promise.resolve([]),
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
            keyMarkets: keyMarketsList,
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
