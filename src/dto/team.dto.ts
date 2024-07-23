import { Prisma, viewship_type } from "@prisma/client";
import { TTeamDetails } from "../types/team.type.js";

export class TeamResponseDTO {
    teamName?: string;
    teamOwners?: string[];
    sport?: string;
    league?: string;
    yearOfInception!: string | null;
    franchiseFee!: Prisma.Decimal | null;
    hqCity?: string;
    hqState?: string;
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
    associationLevel!: (string | null | undefined)[];
    associationCost?: (string | null)[];
    tiers!: (string | undefined)[];
    personalityTraits?: {
        subPersonalityTraits: string;
        mainPersonalityTrait: string;
    }[];
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
        asset: string[];
        market: string[];
        name: string | null;
        type: string[];
        year: string | null;
        partner?: string;
    }[];
    contactPersons?: {
        name: string;
        designation: string | null;
        email: string | null;
        number: string | null;
        linkedin: string | null;
    }[];
    metrics?: {
        reach: string | null;
        viewership: string | null;
        viewershipType: viewship_type | null;
        year: string | null;
    }[];

    static toResponse(teamDetails: TTeamDetails): TeamResponseDTO {
        const teamDTO = new TeamResponseDTO();
        teamDTO.teamName = teamDetails.team_name;
        teamDTO.teamOwners = teamDetails.dashapp_team_owner.map(
            (owner) => owner.dashapp_teamowner.name,
        );
        teamDTO.sport = teamDetails.dashapp_sport?.name;
        teamDTO.league = teamDetails.dashapp_leagueinfo?.property_name;
        teamDTO.yearOfInception = teamDetails.year_of_inception;
        teamDTO.franchiseFee = teamDetails.franchise_fee;
        teamDTO.hqCity = teamDetails.dashapp_hqcity?.name;
        teamDTO.hqState = teamDetails.hq_state?.state;
        teamDTO.instagram = teamDetails.instagram;
        teamDTO.facebook = teamDetails.facebook;
        teamDTO.twitter = teamDetails.twitter;
        teamDTO.linkedin = teamDetails.linkedin;
        teamDTO.youtube = teamDetails.youtube;
        teamDTO.website = teamDetails.website;
        teamDTO.strategyOverview = teamDetails.strategy_overview;
        teamDTO.taglines = teamDetails.dashapp_team_taglines.map(
            (tagline) => tagline.dashapp_taglines.name,
        );
        teamDTO.endorsements = teamDetails.dashapp_teamendorsements.map(
            (endorse) => endorse.name,
        );
        teamDTO.activeCampaigns = teamDetails.dashapp_team_active_campaigns.map(
            (activeCampaign) => activeCampaign.dashapp_activecampaigns.name,
        );
        teamDTO.primaryMarketingPlatforms =
            teamDetails.dashapp_team_marketing_platforms_primary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        teamDTO.secondaryMarketingPlatforms =
            teamDetails.dashapp_team_marketing_platforms_secondary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        teamDTO.age = teamDetails.dashapp_team_age.map(
            (age) => age.dashapp_age?.age_range,
        );
        teamDTO.gender = teamDetails.dashapp_team_gender.map(
            (gender) => gender.dashapp_gender?.gender_is,
        );
        teamDTO.income = teamDetails.dashapp_team_income.map(
            (income) => income.dashapp_income?.income_class,
        );
        teamDTO.keyMarketPrimary =
            teamDetails.dashapp_team_key_markets_primary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        teamDTO.keyMarketSecondary =
            teamDetails.dashapp_team_key_markets_secondary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        teamDTO.keyMarketTertiary =
            teamDetails.dashapp_team_key_markets_tertiary.map(
                (state) => state.dashapp_states.state,
            );
        teamDTO.associationLevel = teamDetails.association.map(
            (asso) => asso.association_level?.name,
        );
        teamDTO.associationCost = teamDetails.association.map(
            (asso) => asso.cost,
        );
        teamDTO.tiers = teamDetails.dashapp_team_tier.map(
            (tier) => tier.dashapp_tier?.name,
        );
        teamDTO.personalityTraits =
            teamDetails.dashapp_team_personality_traits.map((trait) => ({
                subPersonalityTraits: trait.dashapp_subpersonality.name,
                mainPersonalityTrait:
                    trait.dashapp_subpersonality.dashapp_mainpersonality.name,
            }));
        teamDTO.sportsDealSummary = teamDetails.dashapp_sportsdealsummary.map(
            (deal) => ({
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
            }),
        );
        teamDTO.activationSummary = teamDetails.dashapp_activation.map(
            (activation) => ({
                asset: activation.dashapp_activation_assets.map(
                    (asset) => asset.dashapp_assets.asset,
                ),
                market: activation.dashapp_activation_market.map(
                    (market) => market.dashapp_states.state,
                ),
                partner: activation.dashapp_companydata?.company_name,
                name: activation.name,
                type: activation.dashapp_activation_type.map(
                    (type) => type.dashapp_marketingplatform.platform,
                ),
                year: activation.Year,
            }),
            (teamDTO.contactPersons = teamDetails.dashapp_teamcontact.map(
                (contact) => ({
                    designation: contact.contact_designation,
                    email: contact.contact_email,
                    linkedin: contact.contact_linkedin,
                    name: contact.contact_name,
                    number: contact.contact_no,
                }),
            )),
        );
        teamDTO.metrics = teamDetails.dashapp_metric.map((metric) => ({
            reach: metric.reach,
            viewership: metric.viewership,
            viewershipType: metric.viewship_type,
            year: metric.year,
        }));

        return teamDTO;
    }
}
