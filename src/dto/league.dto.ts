import { Prisma, viewship_type } from "@prisma/client";
import { TLeagueDetails } from "../types/league.type.js";

export class LeagueResponseDTO {
    id?: string;
    name?: string;
    sport?: string;
    owners?: string[];
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
    primaryKeyMarket?: string[];
    secondaryKeyMarket?: string[];
    tertiary?: string[];
    primaryMarketingPlatform?: string[];
    secondaryMarketingPlatform?: string[];
    associationLevel!: (string | null | undefined)[];
    associationCost?: (Prisma.Decimal | null)[];
    tiers!: (string | undefined)[];
    subPersonalityTriats!: string[];
    mainPersonalityTraits!: string[];
    team?: string[];
    gender?: string[];
    endorsements?: string[];
    format?: string;
    age?: (string | undefined)[];
    nccs?: string[];
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

    static toResponse(leagueDetails: TLeagueDetails): LeagueResponseDTO {
        const leagueDTO = new LeagueResponseDTO();
        (leagueDTO.id = leagueDetails.id.toString()),
            (leagueDTO.name = leagueDetails.property_name);
        leagueDTO.sport = leagueDetails.dashapp_sport?.name;
        leagueDTO.owners = leagueDetails.dashapp_leagueinfo_owner.map(
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
        leagueDTO.gender = leagueDetails.dashapp_leagueinfo_gender.map(
            (gender) => gender.dashapp_gender.gender_is,
        );
        leagueDTO.team = leagueDetails.dashapp_team.map(
            (team) => team.team_name,
        );
        leagueDTO.format = leagueDetails.format?.format;
        leagueDTO.activeCampaigns =
            leagueDetails.dashapp_leagueinfo_active_campaigns.map(
                (activeCampaign) => activeCampaign.dashapp_activecampaigns.name,
            );
        leagueDTO.primaryKeyMarket =
            leagueDetails.dashapp_leagueinfo_key_markets_primary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        leagueDTO.secondaryKeyMarket =
            leagueDetails.dashapp_leagueinfo_key_markets_secondary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        leagueDTO.tertiary =
            leagueDetails.dashapp_leagueinfo_key_markets_tertiary.map(
                (state) => state.dashapp_states.state,
            );
        leagueDTO.primaryMarketingPlatform =
            leagueDetails.dashapp_leagueinfo_marketing_platforms_primary.map(
                (platform) => platform.dashapp_marketingplatform.platform,
            );
        leagueDTO.secondaryMarketingPlatform =
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
        leagueDTO.subPersonalityTriats =
            leagueDetails.dashapp_leagueinfo_personality_traits.map(
                (trait) => trait.dashapp_subpersonality.name,
            );
        leagueDTO.mainPersonalityTraits =
            leagueDetails.dashapp_leagueinfo_personality_traits.map(
                (trait) =>
                    trait.dashapp_subpersonality.dashapp_mainpersonality.name,
            );
        leagueDTO.endorsements = leagueDetails.dashapp_leagueendorsements.map(
            (endorse) => endorse.name,
        );
        leagueDTO.age = leagueDetails.dashapp_leagueinfo_age.map(
            (age) => age.dashapp_age?.age_range,
        );
        leagueDTO.nccs = leagueDetails.dashapp_leagueinfo_income.map(
            (nccs) => nccs.dashapp_nccs.nccs_class,
        );
        leagueDTO.sportsDealSummary =
            leagueDetails.dashapp_sportsdealsummary.map((deal) => ({
                annualValue: deal.annual_value,
                assets: deal.dashapp_sportsdeal_assets.map(
                    (asset) => asset.dashapp_assets.asset,
                ),
                commencementDate: deal.commencement_date,
                duration: deal.duration,
                expirationDate: deal.expiration_date,
                level: deal.dashapp_level?.name,
                mediaLink: deal.media_link,
                brandName: deal.dashapp_companydata?.company_name,
                athleteName: deal.dashapp_athlete?.athlete_name,
                leagueName: deal.dashapp_leagueinfo?.property_name,
                teamName: deal.dashapp_team?.team_name,
                status: deal.status,
                territory: deal.dashapp_territory?.name,
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
                brandName: activation.dashapp_companydata?.company_name,
                athleteName: activation.dashapp_athlete?.athlete_name,
                leagueName: activation.dashapp_leagueinfo?.property_name,
                teamName: activation.dashapp_team?.team_name,
                year: activation.Year,
            }),
            (leagueDTO.contactPersons = leagueDetails.dashapp_leaguecontact.map(
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
        leagueDTO.viewershipMetrics = leagueDetails.dashapp_viewership.map(
            (metric) => ({
                viewership: metric.viewership,
                viewershipType: metric.viewship_type,
                year: metric.year,
            }),
        );
        leagueDTO.reachMetrics = leagueDetails.dashapp_reach.map((metric) => ({
            reach: metric.reach,
            year: metric.year,
        }));

        return leagueDTO;
    }
}
