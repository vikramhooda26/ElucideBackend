import { Request, Response } from "express";
import { metadataStore } from "../managers/MetadataManager.js";
import { STATUS_CODE } from "../lib/constants.js";
import { prisma } from "../db/index.js";
import { TGetAllMetadataSchema } from "../schemas/metadata.schema.js";

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

    const ageRanges = age
        ? await prisma.dashapp_age.findMany({
              select: { id: true, age_range: true },
          })
        : [];

    const genders = gender
        ? await prisma.dashapp_gender.findMany({
              select: { id: true, gender_is: true },
          })
        : [];

    const cities = city
        ? await prisma.dashapp_hqcity.findMany({
              select: { id: true, name: true },
          })
        : [];

    const states = state
        ? await prisma.dashapp_states.findMany({
              select: { id: true, state: true },
          })
        : [];

    const activeCampaigns = activeCampaign
        ? await prisma.dashapp_activecampaigns.findMany({
              select: { id: true, name: true },
          })
        : [];

    const agencies = agency
        ? await prisma.dashapp_agency.findMany({
              select: { id: true, name: true },
          })
        : [];

    const assets = asset
        ? await prisma.dashapp_assets.findMany({
              select: { id: true, asset: true },
          })
        : [];

    const broadcastPartners = broadcastPartner
        ? await prisma.dashapp_broadcastpartner.findMany({
              select: { id: true, name: true },
          })
        : [];

    const categories = category
        ? await prisma.dashapp_subcategory.findMany({
              select: { id: true, subcategory: true },
          })
        : [];

    const formats = format
        ? await prisma.dashapp_format.findMany({
              select: { id: true, format: true },
          })
        : [];

    const keyMarketsList = keyMarkets
        ? await prisma.dashapp_keymarket.findMany({
              select: { id: true, zone: true },
          })
        : [];

    const leagues = league
        ? await prisma.dashapp_leagueinfo.findMany({
              select: { id: true, property_name: true },
          })
        : [];

    const leagueOwners = leagueOwner
        ? await prisma.dashapp_leagueinfo_owner.findMany({
              select: {
                  id: true,
                  dashapp_leagueowner: { select: { name: true } },
              },
          })
        : [];

    const marketingPlatforms = marketingPlatform
        ? await prisma.dashapp_marketingplatform.findMany({
              select: { id: true, platform: true },
          })
        : [];

    const nccsList = nccs
        ? await prisma.dashapp_income.findMany({
              select: { id: true, income_class: true },
          })
        : [];

    const ottPartners = ottPartner
        ? await prisma.dashapp_ottpartner.findMany({
              select: { id: true, name: true },
          })
        : [];

    const parentOrgs = parentOrg
        ? await prisma.dashapp_parentorg.findMany({
              select: { id: true, name: true },
          })
        : [];

    const personalityTraits = personalityTrait
        ? await prisma.dashapp_subpersonality.findMany({
              select: { id: true, name: true },
          })
        : [];

    const sportsDealSummaryLevels = sportsDealSummaryLevel
        ? await prisma.dashapp_sportsdealsummary.findMany({
              select: {
                  id: true,
                  dashapp_companydata: { select: { company_name: true } },
              },
          })
        : [];

    const sportsDealSummaryStatuses = sportsDealSummaryStatus
        ? await prisma.dashapp_athlete_status.findMany({
              select: { id: true, status: true },
          })
        : [];

    const sportsDealSummaryTerritories = sportsDealSummaryTerritory
        ? await prisma.dashapp_territory.findMany({
              select: { id: true, name: true },
          })
        : [];

    const sportsDealSummaryTypes = sportsDealSummaryType
        ? await prisma.dashapp_activation_type.findMany({
              select: {
                  id: true,
                  dashapp_marketingplatform: {
                      select: { platform: true },
                  },
              },
          })
        : [];

    const taglines = tagline
        ? await prisma.dashapp_taglines.findMany({
              select: { id: true, name: true },
          })
        : [];

    const teamOwners = teamOwner
        ? await prisma.dashapp_teamowner.findMany({
              select: { id: true, name: true },
          })
        : [];

    const tertiaries = tertiary
        ? await prisma.dashapp_states.findMany({
              select: { id: true, state: true },
          })
        : [];

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
};
