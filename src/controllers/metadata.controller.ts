import { Request, Response } from "express";
import { metadataStore } from "../managers/MetadataManager.js";
import { METADATA_KEYS, STATUS_CODE } from "../lib/constants.js";
import { TGetAllMetadataSchema } from "../schemas/metadata.schema.js";
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
} from "../services/metadata.service.js";

export const fetchAllMetadata = async (req: Request, res: Response) => {
    const {
        age,
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
        ]);

        Object.values(METADATA_KEYS).forEach((key) => {
            console.log(
                "\n\nkey === METADATA_KEYS[key]:",
                req.validatedData[key as keyof TGetAllMetadataSchema],
            );
            if (req.validatedData[key as keyof TGetAllMetadataSchema]) {
                console.log("\n\nEntered if statement last updated wala");
                metadataStore.setLastUpdated(key, new Date());
            }
        });

        res.status(STATUS_CODE.OK).json({
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
        });
    } catch (error) {
        console.error("Error fetching metadata:", error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            error: "Failed to fetch metadata",
        });
    }
};
