import { Prisma } from "@prisma/client";
import { TBrandDetails } from "../types/brand.type.js";

export class BrandResponseDTO {
    brandId?: bigint;
    companyName?: string;
    parentOrg?: string;
    subcategory?: {
        subcategory: string | undefined;
        category: string | undefined;
    }[];
    hqCity?: string;
    hqState?: string;
    agency?: string;
    tier?: (string | undefined)[];
    instagram!: string | null;
    facebook!: string | null;
    twitter!: string | null;
    linkedin!: string | null;
    youtube!: string | null;
    website!: string | null;
    strategyOverview!: string | null;
    taglines?: string[];
    endorsements?: string[];
    activeCampaigns?: string[];
    primaryMarketingPlatforms?: string[];
    secondaryMarketingPlatforms?: string[];
    age?: (string | undefined)[];
    gender?: (string | undefined)[];
    income?: (string | undefined)[];
    keyMarketPrimary?: string[];
    keyMarketSecondary?: string[];
    keyMarketTertiary?: string[];
    personalityTraits?: {
        subPersonality?: string;
        mainPersonality?: string;
    }[];
    sportsDealSummary?: {
        annualValue: Prisma.Decimal | null;
        assets: string[];
        athleteName?: string;
        leagueName?: string;
        teamName?: string;
        commencementDate: string | null;
        duration: string | null;
        expirationDate: string | null;
        level: string | undefined;
        mediaLink: string | null;
        partner?: string;
        status: string | null;
        territory: string | null;
        totalValue: Prisma.Decimal | null;
        type: string;
    }[];
    activationSummary?: {
        partner?: string;
        name: string | null;
        type: string[];
        market: string[];
        year: string | null;
        asset: string[];
    }[];
    contactPersons?: {
        name: string;
        designation: string | null;
        email: string | null;
        number: string | null;
        linkedin: string | null;
    }[];

    static toResponse(brandDetails: TBrandDetails): BrandResponseDTO {
        const brandDTO = new BrandResponseDTO();
        (brandDTO.brandId = brandDetails.id),
            (brandDTO.companyName = brandDetails.company_name);
        brandDTO.parentOrg = brandDetails.dashapp_parentorg?.name;
        brandDTO.subcategory = brandDetails.dashapp_companydata_subcategory.map(
            (subcategory) => ({
                subcategory: subcategory.dashapp_subcategory?.subcategory,
                category:
                    subcategory.dashapp_subcategory?.dashapp_category.category,
            }),
        );
        brandDTO.hqCity = brandDetails.dashapp_hqcity?.name;
        brandDTO.hqState = brandDetails.dashapp_states?.state;
        brandDTO.agency = brandDetails.dashapp_agency?.name;
        brandDTO.tier = brandDetails.dashapp_companydata_tier.map(
            (tier) => tier.dashapp_tier?.name,
        );
        brandDTO.instagram = brandDetails.instagram;
        brandDTO.facebook = brandDetails.facebook;
        brandDTO.twitter = brandDetails.twitter;
        brandDTO.linkedin = brandDetails.linkedin;
        brandDTO.youtube = brandDetails.youtube;
        brandDTO.website = brandDetails.website;
        brandDTO.strategyOverview = brandDetails.strategy_overview;
        brandDTO.taglines = brandDetails.dashapp_companydata_taglines.map(
            (tagline) => tagline.dashapp_taglines.name,
        );
        brandDTO.endorsements = brandDetails.dashapp_brandendorsements.map(
            (endorse) => endorse.name,
        );
        brandDTO.activeCampaigns =
            brandDetails.dashapp_companydata_active_campaigns.map(
                (activeCampaign) => activeCampaign.dashapp_activecampaigns.name,
            );
        brandDTO.primaryMarketingPlatforms =
            brandDetails.dashapp_companydata_marketing_platforms_primary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        brandDTO.secondaryMarketingPlatforms =
            brandDetails.dashapp_companydata_marketing_platforms_secondary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        brandDTO.age = brandDetails.dashapp_companydata_age.map(
            (age) => age.dashapp_age?.age_range,
        );
        brandDTO.gender = brandDetails.dashapp_companydata_gender.map(
            (gender) => gender.dashapp_gender?.gender_is,
        );
        brandDTO.income = brandDetails.dashapp_companydata_income.map(
            (income) => income.dashapp_income?.income_class,
        );
        brandDTO.keyMarketPrimary =
            brandDetails.dashapp_companydata_key_markets_primary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        brandDTO.keyMarketSecondary =
            brandDetails.dashapp_companydata_key_markets_secondary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        brandDTO.keyMarketTertiary =
            brandDetails.dashapp_companydata_key_markets_tertiary.map(
                (state) => state.dashapp_states.state,
            );
        brandDTO.personalityTraits =
            brandDetails.dashapp_companydata_personality_traits.map(
                (trait) => ({
                    subPersonality: trait.dashapp_subpersonality.name,
                    mainPersonality:
                        trait.dashapp_subpersonality.dashapp_mainpersonality
                            .name,
                }),
            );
        brandDTO.sportsDealSummary = brandDetails.dashapp_sportsdealsummary.map(
            (deal) => ({
                annualValue: deal.annual_value,
                assets: deal.dashapp_sportsdeal_assets.map(
                    (asset) => asset.dashapp_assets.asset,
                ),
                athleteName: deal.dashapp_athlete?.athlete_name,
                leagueName: deal.dashapp_leagueinfo?.property_name,
                teamName: deal.dashapp_team?.team_name,
                commencementDate: deal.commencement_date,
                duration: deal.duration,
                expirationDate: deal.expiration_date,
                level: deal.dashapp_level?.name,
                mediaLink: deal.media_link,
                partner:
                    deal.dashapp_athlete?.athlete_name ||
                    deal.dashapp_leagueinfo?.property_name ||
                    deal.dashapp_team?.team_name,
                status: deal.status,
                territory: deal.territory,
                totalValue: deal.total_value,
                type: deal.type,
            }),
        );
        brandDTO.activationSummary = brandDetails.dashapp_activation.map(
            (activation) => ({
                partner:
                    activation.dashapp_athlete?.athlete_name ||
                    activation.dashapp_leagueinfo?.property_name ||
                    activation.dashapp_team?.team_name,
                name: activation.name,
                type: activation.dashapp_activation_type.map(
                    (type) => type.dashapp_marketingplatform.platform,
                ),
                market: activation.dashapp_activation_market.map(
                    (market) => market.dashapp_states.state,
                ),
                year: activation.Year,
                asset: activation.dashapp_activation_assets.map(
                    (asset) => asset.dashapp_assets.asset,
                ),
            }),
        );
        brandDTO.contactPersons = brandDetails.dashapp_brandcontact.map(
            (contact) => ({
                name: contact.contact_name,
                designation: contact.contact_designation,
                email: contact.contact_email,
                number: contact.contact_no,
                linkedin: contact.contact_linkedin,
            }),
        );

        return brandDTO;
    }
}
