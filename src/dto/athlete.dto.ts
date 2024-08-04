import { Prisma } from "@prisma/client";
import { TAthleteDetails } from "../types/athlete.type.js";

export class AthleteResponseDTO {
    id?: bigint;
    name?: string;
    nationality?: string;
    sport?: string;
    agency?: string;
    instagram?: string | null;
    linkedin?: string | null;
    youtube?: string | null;
    website?: string | null;
    twitter?: string | null;
    facebook?: string | null;
    keyMarketPrimary?: string[];
    keyMarketSecondary?: string[];
    keyMarketTertiary?: string[];
    socialMediaPrimary?: (string | undefined)[];
    socialMediaSecondary?: (string | undefined)[];
    tier?: (string | undefined)[];
    personalityTraits?: {
        subPersonality: string;
        mainPersonality: string;
    }[];
    age?: number | null;
    association?: {
        associationLevel: { name: string | null } | null;
        costOfAssociation: Prisma.Decimal | null;
    }[];
    activations?: {
        year?: string | null;
        name?: string | null;
        type?: string[];
        assets?: string[];
        market?: string[];
        partner?: string;
    }[];
    sportsDealsummary?: {
        annualValue?: Prisma.Decimal | null;
        totalValue?: Prisma.Decimal | null;
        assets?: string[];
        commencementDate?: string | null;
        expirationDate?: string | null;
        duration?: string | null;
        territory?: string | null;
        mediaLink?: string | null;
        level?: string | null;
        status?: string | null;
        type?: string | null;
        partner?: string;
    }[];
    contactPersons?: {
        name: string;
        email?: string | null;
        linkedin?: string | null;
        number?: string | null;
        designation?: string | null;
    }[];
    gender?: string[];
    nccs?: string[];
    keyPlatformPrimary?: string;
    keyPlatformSecondary?: string;
    status?: string;
    state?: string;

    static toResponse(athleteDetails: TAthleteDetails): AthleteResponseDTO {
        const athleteDTO = new AthleteResponseDTO();
        athleteDTO.id = athleteDetails.id;
        athleteDTO.name = athleteDetails.athlete_name;
        athleteDTO.nationality = athleteDetails.nationality?.name;
        athleteDTO.sport = athleteDetails.dashapp_sport?.name;
        athleteDTO.agency = athleteDetails.dashapp_agency?.name;
        athleteDTO.instagram = athleteDetails.instagram;
        athleteDTO.linkedin = athleteDetails.linkedin;
        athleteDTO.youtube = athleteDetails.youtube;
        athleteDTO.website = athleteDetails.website;
        athleteDTO.twitter = athleteDetails.twitter;
        athleteDTO.facebook = athleteDetails.facebook;
        athleteDTO.socialMediaPrimary =
            athleteDetails.dashapp_athlete_socialmedia_platform_primary.map(
                (platform) => platform.dashapp_socialmedia_platform?.name,
            );
        athleteDTO.socialMediaSecondary =
            athleteDetails.dashapp_athlete_socialmedia_platform_secondary.map(
                (platform) => platform.dashapp_socialmedia_platform?.name,
            );
        athleteDTO.keyMarketPrimary =
            athleteDetails.dashapp_athlete_key_markets_primary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        athleteDTO.keyMarketSecondary =
            athleteDetails.dashapp_athlete_key_markets_secondary.map(
                (market) => market.dashapp_keymarket.zone,
            );
        athleteDTO.keyMarketTertiary =
            athleteDetails.dashapp_athlete_key_markets_tertiary.map(
                (state) => state.dashapp_states.state,
            );
        athleteDTO.tier = athleteDetails.dashapp_athlete_tier.map(
            (tier) => tier.dashapp_tier?.name,
        );
        athleteDTO.personalityTraits =
            athleteDetails.dashapp_athlete_personality_traits.map((trait) => ({
                subPersonality: trait.dashapp_subpersonality.name,
                mainPersonality:
                    trait.dashapp_subpersonality.dashapp_mainpersonality.name,
            }));
        athleteDTO.age = athleteDetails.age;
        athleteDTO.association = athleteDetails.association.map((asso) => ({
            associationLevel: asso.association_level,
            costOfAssociation: asso.cost,
        }));
        athleteDTO.activations = athleteDetails.dashapp_activation.map(
            (activation) => ({
                year: activation.Year,
                name: activation.name,
                type: activation.dashapp_activation_type.map(
                    (type) => type.dashapp_marketingplatform.platform,
                ),
                assets: activation.dashapp_activation_assets.map(
                    (asset) => asset.dashapp_assets.asset,
                ),
                market: activation.dashapp_activation_market.map(
                    (market) => market.dashapp_states.state,
                ),
                partner: activation.dashapp_companydata?.company_name,
            }),
        );
        athleteDTO.sportsDealsummary =
            athleteDetails.dashapp_sportsdealsummary.map((deal) => ({
                annualValue: deal.annual_value,
                totalValue: deal.total_value,
                assets: deal.dashapp_sportsdeal_assets.map(
                    (asset) => asset.dashapp_assets.asset,
                ),
                commencementDate: deal.commencement_date,
                expirationDate: deal.expiration_date,
                duration: deal.duration,
                territory: deal.dashapp_territory?.name,
                mediaLink: deal.media_link,
                level: deal.dashapp_level?.name,
                status: deal.status,
                type: deal.type,
                partner: deal.dashapp_companydata?.company_name,
            }));
        athleteDTO.contactPersons = athleteDetails.dashapp_athletecontact.map(
            (contact) => ({
                name: contact.contact_name,
                email: contact.contact_email,
                linkedin: contact.contact_linkedin,
                number: contact.contact_no,
                designation: contact.contact_designation,
            }),
        );
        athleteDTO.gender = athleteDetails.dashapp_athlete_target_gender.map(
            (gender) => gender.dashapp_gender?.gender_is,
        );
        athleteDTO.nccs = athleteDetails.dashapp_athlete_target_income.map(
            (nccs) => nccs.dashapp_nccs?.nccs_class,
        );
        athleteDTO.keyPlatformPrimary =
            athleteDetails.dashapp_athlete_keyplatform_primary?.platform;
        athleteDTO.keyPlatformSecondary =
            athleteDetails.dashapp_athlete_keyplatform_secondary?.platform;
        athleteDTO.status = athleteDetails.dashapp_athlete_status?.status;
        athleteDTO.state = athleteDetails.dashapp_states?.state;

        return athleteDTO;
    }
}
