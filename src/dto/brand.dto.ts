import { Prisma } from "@prisma/client";
import { TBrandDetails } from "../types/brand.type.js";

export class BrandResponseDTO {
    id?: string;
    name?: string;
    parentOrg?: string;
    subcategory!: (string | undefined)[];
    maincategory!: (string | undefined)[];
    city?: string;
    state?: string;
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
    primaryMarketingPlatform?: string[];
    secondaryMarketingPlatform?: string[];
    age?: (string | undefined)[];
    gender?: (string | undefined)[];
    nccs?: (string | undefined)[];
    primaryKeyMarket?: string[];
    secondaryKeyMarket?: string[];
    tertiary?: string[];
    subPersonalityTraits?: string[];
    mainPersonalityTraits?: string[];
    sportsDealSummary?: {
        annualValue?: string;
        assets: string[];
        athleteName?: string;
        leagueName?: string;
        teamName?: string;
        commencementDate: string | null;
        duration: string | null;
        expirationDate: string | null;
        level: string | undefined;
        mediaLink: string | null;
        brandName?: string;
        status: string | null;
        territory?: string;
        totalValue?: string;
        type: string;
    }[];
    activationSummary?: {
        brandName?: string;
        athleteName?: string;
        leagueName?: string;
        teamName?: string;
        name: string | null;
        type: string[];
        market: string[];
        year: string | null;
        asset: string[];
    }[];
    contactPersons?: {
        id: string;
        name: string;
        designation: string | null;
        email: string | null;
        number: string | null;
        linkedin: string | null;
    }[];

    static toResponse(brandDetails: TBrandDetails): BrandResponseDTO {
        const brandDTO = new BrandResponseDTO();
        (brandDTO.id = brandDetails.id.toString()),
            (brandDTO.name = brandDetails.company_name);
        brandDTO.parentOrg = brandDetails.dashapp_parentorg?.name;
        brandDTO.subcategory = brandDetails.dashapp_companydata_subcategory.map(
            (subcategory) => subcategory.dashapp_subcategory?.subcategory,
        );
        brandDTO.maincategory =
            brandDetails.dashapp_companydata_subcategory.map(
                (subcategory) =>
                    subcategory.dashapp_subcategory?.dashapp_category.category,
            );
        brandDTO.city = brandDetails.dashapp_hqcity?.name;
        brandDTO.state = brandDetails.dashapp_states?.state;
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
        brandDTO.primaryMarketingPlatform =
            brandDetails.dashapp_companydata_marketing_platforms_primary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        brandDTO.secondaryMarketingPlatform =
            brandDetails.dashapp_companydata_marketing_platforms_secondary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        brandDTO.age = brandDetails.dashapp_companydata_age.map(
            (age) => age.dashapp_age?.age_range,
        );
        brandDTO.gender = brandDetails.dashapp_companydata_gender.map(
            (gender) => gender.dashapp_gender?.gender_is,
        );
        brandDTO.nccs = brandDetails.dashapp_companydata_income.map(
            (nccs) => nccs.dashapp_nccs?.nccs_class,
        );
        brandDTO.primaryKeyMarket =
            brandDetails.dashapp_companydata_key_markets_primary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        brandDTO.secondaryKeyMarket =
            brandDetails.dashapp_companydata_key_markets_secondary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        brandDTO.tertiary =
            brandDetails.dashapp_companydata_key_markets_tertiary.map(
                (state) => state.dashapp_states.state,
            );
        brandDTO.subPersonalityTraits =
            brandDetails.dashapp_companydata_personality_traits.map(
                (trait) => trait.dashapp_subpersonality.name,
            );
        brandDTO.mainPersonalityTraits =
            brandDetails.dashapp_companydata_personality_traits.map(
                (trait) =>
                    trait.dashapp_subpersonality.dashapp_mainpersonality.name,
            );
        brandDTO.sportsDealSummary = brandDetails.dashapp_sportsdealsummary.map(
            (deal) => ({
                annualValue: deal.annual_value?.toString(),
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
                brandName: deal.dashapp_companydata?.company_name,
                status: deal.status,
                territory: deal.dashapp_territory?.name,
                totalValue: deal.total_value?.toString(),
                type: deal.type,
            }),
        );
        brandDTO.activationSummary = brandDetails.dashapp_activation.map(
            (activation) => ({
                brandName: activation.dashapp_companydata?.company_name,
                athleteName: activation.dashapp_athlete?.athlete_name,
                leagueName: activation.dashapp_leagueinfo?.property_name,
                teamName: activation.dashapp_team?.team_name,
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
                id: contact.id.toString(),
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
