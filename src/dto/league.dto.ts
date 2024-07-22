import { Prisma } from "@prisma/client";
import { TLeagueDetails } from "../db/league.payload.js";

export class LeagueResponseDTO {
    leagueName?: string;
    sport?: string;
    leagueOwner?: string[];
    yearOfInception!: string | null;
    broadcastPartner?: string;
    ottPartner?: string;
    instagram!: string | null;
    facebook!: string | null;
    linkedin!: string | null;
    youtube!: string | null;
    website!: string | null;
    twitter!: string | null;
    strategyOverview!: string | null;
    taglines?: string[];
    activeCampaigns?: string[];
    keyMarketPrimary?: string[];
    keyMarketSecondary?: string[];
    keyMarketTertiary?: string[];
    primaryMarketingPlatforms?: string[];
    secondaryMarketingPlatforms?: string[];
    associationLevel!: (string | null | undefined)[];
    associationCost?: (string | null)[];
    tiers!: (string | undefined)[];
    personalityTraits?: {
        subPersonalityTriats?: string[];
        mainPersonalityTrait?: string;
    }[];
    endorsements?: string[];
    age?: (string | undefined)[];
    incomeClass?: string[];
    sportsDealSummary?: {
        annualValue: Prisma.Decimal | null;
        assets: { dashapp_assets: { asset: string } }[];
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
        // TODO: have to add property_name and partner after asking the client
        asset: string[];
        market: string[];
        name: string | null;
        type: string[];
        year: string | null;
    }[];
    contactPerson?: {
        name: string;
        designation: string | null;
        email: string | null;
        number: string | null;
        linkedin: string | null;
    }[];

    static toResponse(leagueDetails: TLeagueDetails): LeagueResponseDTO {
        const leagueDTO = new LeagueResponseDTO();
        leagueDTO.leagueName = leagueDetails.property_name;
        leagueDTO.sport = leagueDetails.dashapp_sport?.name;
        leagueDTO.leagueOwner = leagueDetails.dashapp_leagueinfo_owner.map(
            (owner) => owner.dashapp_leagueowner.name,
        );
        leagueDTO.yearOfInception = leagueDetails.year_of_inception;
        leagueDTO.broadcastPartner =
            leagueDetails.dashapp_broadcastpartner?.name;
        leagueDTO.ottPartner = leagueDetails.dashapp_ottpartner?.name;
        leagueDTO.instagram = leagueDetails.instagram;
        leagueDTO.facebook = leagueDetails.facebook;
        leagueDTO.linkedin = leagueDetails.linkedin;
        leagueDTO.youtube = leagueDetails.youtube;
        leagueDTO.website = leagueDetails.website;
        leagueDTO.twitter = leagueDetails.twitter;
        leagueDTO.strategyOverview = leagueDetails.strategy_overview;
        leagueDTO.taglines = leagueDetails.dashapp_leagueinfo_taglines.map(
            (tagline) => tagline.dashapp_taglines.name,
        );
        leagueDTO.activeCampaigns =
            leagueDetails.dashapp_leagueinfo_active_campaigns.map(
                (activeCampaign) => activeCampaign.dashapp_activecampaigns.name,
            );
        leagueDTO.keyMarketPrimary =
            leagueDetails.dashapp_leagueinfo_key_markets_primary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        leagueDTO.keyMarketSecondary =
            leagueDetails.dashapp_leagueinfo_key_markets_secondary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        leagueDTO.keyMarketTertiary =
            leagueDetails.dashapp_leagueinfo_key_markets_tertiary.map(
                (state) => state.dashapp_states.state,
            );
        leagueDTO.primaryMarketingPlatforms =
            leagueDetails.dashapp_leagueinfo_marketing_platforms_primary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        leagueDTO.secondaryMarketingPlatforms =
            leagueDetails.dashapp_leagueinfo_marketing_platforms_secondary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        leagueDTO.associationLevel = leagueDetails.association.map(
            (asso) => asso.association_level?.name,
        );
        leagueDTO.associationCost = leagueDetails.association.map(
            (asso) => asso.cost,
        );
        leagueDTO.tiers = leagueDetails.dashapp_leagueinfo_tier.map(
            (tier) => tier.dashapp_tier?.name,
        );
        leagueDTO.endorsements = leagueDetails.dashapp_leagueendorsements.map(
            (endorse) => endorse.name,
        );
        leagueDTO.age = leagueDetails.dashapp_leagueinfo_age.map(
            (age) => age.dashapp_age?.age_range,
        );
        leagueDTO.incomeClass = leagueDetails.dashapp_leagueinfo_income.map(
            (income) => income.dashapp_income.income_class,
        );
        leagueDTO.sportsDealSummary =
            leagueDetails.dashapp_sportsdealsummary.map((deal) => ({
                annualValue: deal.annual_value,
                assets: deal.assets,
                commencementDate: deal.commencement_date,
                duration: deal.duration,
                expirationDate: deal.expiration_date,
                level: deal.dashapp_level?.name,
                mediaLink: deal.media_link,
                partner: deal.dashapp_companydata?.company_name,
                status: deal.status,
                territory: deal.territory,
                totalValue: deal.total_value,
                type: deal.type,
            }));
        leagueDTO.activationSummary = leagueDetails.dashapp_activation.map(
            (activation) => ({
                asset: activation.dashapp_activation_assets.map(
                    (asset) => asset.dashapp_assets.asset,
                ),
                market: activation.dashapp_activation_market.map(
                    (market) => market.dashapp_states.state,
                ),
                name: activation.name,
                type: activation.dashapp_activation_type.map(
                    (type) => type.dashapp_marketingplatform.platform,
                ),
                year: activation.Year,
            }),
            (leagueDTO.contactPerson = leagueDetails.dashapp_leaguecontact.map(
                (contact) => ({
                    designation: contact.contact_designation,
                    email: contact.contact_email,
                    linkedin: contact.contact_linkedin,
                    name: contact.contact_name,
                    number: contact.contact_no,
                }),
            )),
        );

        return leagueDTO;
    }
}
