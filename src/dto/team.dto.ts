import { Prisma, viewship_type } from "@prisma/client";
import { TTeamDetails } from "../types/team.type.js";

export class TeamResponseDTO {
    id?: string;
    name?: string;
    owners?: string[];
    sport?: string;
    league?: string;
    yearOfInception!: string | null;
    franchiseFee!: Prisma.Decimal | null;
    city?: string;
    state?: string;
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
    associationLevel!: (string | null | undefined)[];
    associationCost?: (Prisma.Decimal | null)[];
    tiers!: (string | undefined)[];
    subPersonalityTraits!: string[];
    mainPersonalityTraits!: string[];
    sportsDealSummary?: {
        annualValue: Prisma.Decimal | null;
        assets: string[];
        commencementDate: string | null;
        duration: string | null;
        expirationDate: string | null;
        level: string | undefined;
        mediaLink: string | null;
        athleteName?: string;
        leagueName?: string;
        teamName?: string;
        brandName?: string;
        status: string | null;
        territory?: string;
        totalValue: Prisma.Decimal | null;
        type: string;
    }[];
    activationSummary?: {
        asset: string[];
        market: string[];
        name: string | null;
        type: string[];
        year: string | null;
        athleteName?: string;
        leagueName?: string;
        teamName?: string;
        brandName?: string;
    }[];
    contactPersons?: {
        id: string;
        name: string;
        designation: string | null;
        email: string | null;
        number: string | null;
        linkedin: string | null;
    }[];
    viewershipMetrics?: {
        viewership: string | null;
        viewershipType: viewship_type | null;
        year: string | null;
    }[];
    reachMetrics?: {
        reach: string | null;
        year: string | null;
    }[];

    static toResponse(teamDetails: TTeamDetails): TeamResponseDTO {
        const teamDTO = new TeamResponseDTO();
        (teamDTO.id = teamDetails.id.toString()),
            (teamDTO.name = teamDetails.team_name);
        teamDTO.owners = teamDetails.dashapp_team_owner.map(
            (owner) => owner.dashapp_teamowner.name,
        );
        teamDTO.sport = teamDetails.dashapp_sport?.name;
        teamDTO.league = teamDetails.dashapp_leagueinfo?.property_name;
        teamDTO.yearOfInception = teamDetails.year_of_inception;
        teamDTO.franchiseFee = teamDetails.franchise_fee;
        teamDTO.city = teamDetails.dashapp_hqcity?.name;
        teamDTO.state = teamDetails.dashapp_states?.state;
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
        teamDTO.primaryMarketingPlatform =
            teamDetails.dashapp_team_marketing_platforms_primary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        teamDTO.secondaryMarketingPlatform =
            teamDetails.dashapp_team_marketing_platforms_secondary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        teamDTO.age = teamDetails.dashapp_team_age.map(
            (age) => age.dashapp_age?.age_range,
        );
        teamDTO.gender = teamDetails.dashapp_team_gender.map(
            (gender) => gender.dashapp_gender?.gender_is,
        );
        teamDTO.nccs = teamDetails.dashapp_team_income.map(
            (nccs) => nccs.dashapp_nccs?.nccs_class,
        );
        teamDTO.primaryKeyMarket =
            teamDetails.dashapp_team_key_markets_primary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        teamDTO.secondaryKeyMarket =
            teamDetails.dashapp_team_key_markets_secondary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        teamDTO.tertiary = teamDetails.dashapp_team_key_markets_tertiary.map(
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
        teamDTO.subPersonalityTraits =
            teamDetails.dashapp_team_personality_traits.map(
                (trait) => trait.dashapp_subpersonality.name,
            );
        teamDTO.mainPersonalityTraits =
            teamDetails.dashapp_team_personality_traits.map(
                (trait) =>
                    trait.dashapp_subpersonality.dashapp_mainpersonality.name,
            );
        teamDTO.sportsDealSummary = teamDetails.dashapp_sportsdealsummary.map(
            (deal) => ({
                annualValue: deal.annual_value,
                assets: deal.dashapp_sportsdeal_assets.map(
                    (assest) => assest.dashapp_assets.asset,
                ),
                commencementDate: deal.commencement_date,
                duration: deal.duration,
                expirationDate: deal.expiration_date,
                level: deal.dashapp_level?.name,
                mediaLink: deal.media_link,
                brandName: deal.dashapp_companydata?.company_name,
                leagueName: deal.dashapp_leagueinfo?.property_name,
                teamName: deal.dashapp_team?.team_name,
                athleteName: deal.dashapp_athlete?.athlete_name,
                status: deal.status,
                territory: deal.dashapp_territory?.name,
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
                brandName: activation.dashapp_companydata?.company_name,
                leagueName: activation.dashapp_leagueinfo?.property_name,
                teamName: activation.dashapp_team?.team_name,
                athleteName: activation.dashapp_athlete?.athlete_name,
                name: activation.name,
                type: activation.dashapp_activation_type.map(
                    (type) => type.dashapp_marketingplatform.platform,
                ),
                year: activation.Year,
            }),
            (teamDTO.contactPersons = teamDetails.dashapp_teamcontact.map(
                (contact) => ({
                    id: contact.id.toString(),
                    designation: contact.contact_designation,
                    email: contact.contact_email,
                    linkedin: contact.contact_linkedin,
                    name: contact.contact_name,
                    number: contact.contact_no,
                }),
            )),
        );
        teamDTO.viewershipMetrics = teamDetails.dashapp_viewership.map(
            (metric) => ({
                viewership: metric.viewership,
                viewershipType: metric.viewship_type,
                year: metric.year,
            }),
        );
        teamDTO.reachMetrics = teamDetails.dashapp_reach.map((metric) => ({
            reach: metric.reach,
            year: metric.year,
        }));

        return teamDTO;
    }
}
