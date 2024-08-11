import { Prisma } from "@prisma/client";
import { TAthleteDetails } from "../types/athlete.type.js";
import { parseISO } from "date-fns";
import { printLogs } from "../lib/log.js";

export class AthleteResponseDTO {
    id?: string;
    name?: string;
    nationality?: {
        id?: string;
        name?: string;
    };
    sport?: {
        id?: string;
        name?: string;
    };
    agency?: {
        id?: string;
        name?: string;
    };
    instagram?: string | null;
    linkedin?: string | null;
    youtube?: string | null;
    website?: string | null;
    twitter?: string | null;
    facebook?: string | null;
    primaryKeyMarket?: {
        id?: string;
        name?: string;
    }[];
    secondaryKeyMarket?: {
        id?: string;
        name?: string;
    }[];
    tertiary?: {
        id?: string;
        name?: string;
    }[];
    primarySocialMedia?: {
        id?: string;
        name?: string;
    }[];
    secondarySocialMedia?: {
        id?: string;
        name?: string;
    }[];
    tier?: {
        id?: string;
        name?: string;
    }[];
    subPersonalityTraits?: {
        id?: string;
        name?: string;
    }[];
    mainPersonalityTraits?: {
        id?: string;
        name?: string;
    }[];
    age?: Date | null;
    associationLevel?: {
        id?: string;
        name?: string | null;
    };
    costOfAssociation?: Prisma.Decimal | null;
    associationId?: string;
    activations?: {
        id?: string;
        year?: string | null;
        name?: string | null;
        type?: {
            id?: string;
            name?: string;
        }[];
        assets?: {
            id?: string;
            name?: string;
        }[];
        market?: {
            id?: string;
            name?: string;
        }[];
        brandName?: {
            id?: string;
            name?: string;
        };
        athleteName?: {
            id?: string;
            name?: string;
        };
        leagueName?: {
            id?: string;
            name?: string;
        };
        teamName?: {
            id?: string;
            name?: string;
        };
    }[];
    sportsDealsummary?: {
        id?: string;
        annualValue?: Prisma.Decimal | null;
        totalValue?: Prisma.Decimal | null;
        assets?: {
            id: string;
            name: string;
        }[];
        commencementDate?: string | null;
        expirationDate?: string | null;
        duration?: string | null;
        territory?: {
            id?: string;
            name?: string;
        };
        mediaLink?: string | null;
        level?: {
            id?: string;
            name?: string;
        };
        status?: string | null;
        type?: string | null;
        brandName?: {
            id?: string;
            name?: string;
        };
        athleteName?: {
            id?: string;
            name?: string;
        };
        leagueName?: {
            id?: string;
            name?: string;
        };
        teamName?: {
            id?: string;
            name?: string;
        };
    }[];
    contactPersons?: {
        id: string;
        name: string;
        email?: string | null;
        linkedin?: string | null;
        number?: string | null;
        designation?: string | null;
    }[];
    gender?: {
        id?: string;
        name?: string;
    }[];
    nccs?: {
        id?: string;
        name?: string;
    }[];
    primaryMarketingPlatform?: {
        id?: string;
        name?: string;
    };
    secondaryMarketingPlatform?: {
        id?: string;
        name?: string;
    };
    status?: {
        id?: string;
        name?: string;
    };
    state?: {
        id?: string;
        name?: string;
    };

    static toResponse(athleteDetails: TAthleteDetails): AthleteResponseDTO {
        const athleteDTO = new AthleteResponseDTO();
        athleteDTO.id = athleteDetails.id.toString();
        athleteDTO.name = athleteDetails.athlete_name;
        athleteDTO.nationality = {
            id: athleteDetails.nationality?.id.toString(),
            name: athleteDetails.nationality?.name,
        };
        athleteDTO.sport = {
            id: athleteDetails.dashapp_sport?.id.toString(),
            name: athleteDetails.dashapp_sport?.name,
        };
        athleteDTO.agency = {
            id: athleteDetails.dashapp_agency?.id.toString(),
            name: athleteDetails.dashapp_agency?.name,
        };
        athleteDTO.instagram = athleteDetails.instagram;
        athleteDTO.linkedin = athleteDetails.linkedin;
        athleteDTO.youtube = athleteDetails.youtube;
        athleteDTO.website = athleteDetails.website;
        athleteDTO.twitter = athleteDetails.twitter;
        athleteDTO.facebook = athleteDetails.facebook;
        athleteDTO.primarySocialMedia =
            athleteDetails.dashapp_athlete_socialmedia_platform_primary.map(
                (platform) => ({
                    id: platform.dashapp_socialmedia_platform?.id.toString(),
                    name: platform.dashapp_socialmedia_platform?.name,
                }),
            );
        athleteDTO.secondarySocialMedia =
            athleteDetails.dashapp_athlete_socialmedia_platform_secondary.map(
                (platform) => ({
                    id: platform.dashapp_socialmedia_platform?.id.toString(),
                    name: platform.dashapp_socialmedia_platform?.name,
                }),
            );
        athleteDTO.primaryKeyMarket =
            athleteDetails.dashapp_athlete_key_markets_primary.map(
                (market) => ({
                    id: market.dashapp_keymarket.id.toString(),
                    name: market.dashapp_keymarket.zone,
                }),
            );
        athleteDTO.secondaryKeyMarket =
            athleteDetails.dashapp_athlete_key_markets_secondary.map(
                (market) => ({
                    id: market.dashapp_keymarket.id.toString(),
                    name: market.dashapp_keymarket.zone,
                }),
            );
        athleteDTO.tertiary =
            athleteDetails.dashapp_athlete_key_markets_tertiary.map(
                (state) => ({
                    id: state.dashapp_states.id.toString(),
                    name: state.dashapp_states.state,
                }),
            );
        athleteDTO.tier = athleteDetails.dashapp_athlete_tier.map((tier) => ({
            id: tier.dashapp_tier?.id.toString(),
            name: tier.dashapp_tier?.name,
        }));
        athleteDTO.subPersonalityTraits =
            athleteDetails.dashapp_athlete_personality_traits.map((trait) => ({
                id: trait.dashapp_subpersonality.id.toString(),
                name: trait.dashapp_subpersonality.name,
            }));
        athleteDTO.mainPersonalityTraits =
            athleteDetails.dashapp_athlete_personality_traits.map((trait) => ({
                id: trait.dashapp_subpersonality.dashapp_mainpersonality.id.toString(),
                name: trait.dashapp_subpersonality.dashapp_mainpersonality.name,
            }));
        athleteDTO.age = athleteDetails?.age
            ? parseISO(athleteDetails?.age)
            : undefined;
        athleteDTO.associationLevel = {
            id: athleteDetails.association?.association_level?.id.toString(),
            name: athleteDetails.association?.association_level?.name,
        };
        athleteDTO.costOfAssociation = athleteDetails.association?.cost;
        printLogs(
            "Association ID in DTO layer athelet",
            athleteDetails.association?.id.toString(),
        );
        athleteDTO.associationId = athleteDetails.association?.id.toString();
        athleteDTO.activations = athleteDetails.dashapp_activation.map(
            (activation) => ({
                year: activation.Year,
                name: activation.name,
                type: activation.dashapp_activation_type.map((type) => ({
                    id: type.dashapp_marketingplatform.id.toString(),
                    name: type.dashapp_marketingplatform.platform,
                })),
                assets: activation.dashapp_activation_assets.map((asset) => ({
                    id: asset.dashapp_assets.id.toString(),
                    name: asset.dashapp_assets.asset,
                })),
                market: activation.dashapp_activation_market.map((market) => ({
                    id: market.dashapp_states.id.toString(),
                    name: market.dashapp_states.state,
                })),
                brandName: {
                    id: activation.dashapp_companydata?.id.toString(),
                    name: activation.dashapp_companydata?.company_name,
                },
                athleteName: {
                    id: activation.dashapp_athlete?.id.toString(),
                    name: activation.dashapp_athlete?.athlete_name,
                },
                teamName: {
                    id: activation.dashapp_team?.id.toString(),
                    name: activation.dashapp_team?.team_name,
                },
                leagueName: {
                    id: activation.dashapp_leagueinfo?.id.toString(),
                    name: activation.dashapp_leagueinfo?.property_name,
                },
            }),
        );
        athleteDTO.sportsDealsummary =
            athleteDetails.dashapp_sportsdealsummary.map((deal) => ({
                annualValue: deal.annual_value,
                totalValue: deal.total_value,
                assets: deal.dashapp_sportsdeal_assets.map((asset) => ({
                    id: asset.dashapp_assets.id.toString(),
                    name: asset.dashapp_assets.asset,
                })),
                commencementDate: deal.commencement_date,
                expirationDate: deal.expiration_date,
                duration: deal.duration,
                territory: {
                    id: deal.dashapp_territory?.id.toString(),
                    name: deal.dashapp_territory?.name,
                },
                mediaLink: deal.media_link,
                level: {
                    id: deal.dashapp_level?.id.toString(),
                    name: deal.dashapp_level?.name,
                },
                status: deal.status,
                type: deal.type,
                brandName: {
                    id: deal.dashapp_companydata?.id.toString(),
                    name: deal.dashapp_companydata?.company_name,
                },
                athleteName: {
                    id: deal.dashapp_athlete?.id.toString(),
                    name: deal.dashapp_athlete?.athlete_name,
                },
                teamName: {
                    id: deal.dashapp_team?.id.toString(),
                    name: deal.dashapp_team?.team_name,
                },
                leagueName: {
                    id: deal.dashapp_leagueinfo?.id.toString(),
                    name: deal.dashapp_leagueinfo?.property_name,
                },
            }));
        athleteDTO.contactPersons = athleteDetails.dashapp_athletecontact.map(
            (contact) => ({
                id: contact.id.toString(),
                name: contact.contact_name,
                email: contact.contact_email,
                linkedin: contact.contact_linkedin,
                number: contact.contact_no,
                designation: contact.contact_designation,
            }),
        );
        athleteDTO.gender = athleteDetails.dashapp_athlete_target_gender.map(
            (gender) => ({
                id: gender.dashapp_gender?.id.toString(),
                name: gender.dashapp_gender?.gender_is,
            }),
        );
        athleteDTO.nccs = athleteDetails.dashapp_athlete_target_income.map(
            (nccs) => ({
                id: nccs.dashapp_nccs?.id.toString(),
                name: nccs.dashapp_nccs?.nccs_class,
            }),
        );
        athleteDTO.primaryMarketingPlatform = {
            id: athleteDetails.dashapp_athlete_keyplatform_primary?.id.toString(),
            name: athleteDetails.dashapp_athlete_keyplatform_primary?.platform,
        };
        athleteDTO.secondaryMarketingPlatform = {
            id: athleteDetails.dashapp_athlete_keyplatform_secondary?.id.toString(),
            name: athleteDetails.dashapp_athlete_keyplatform_secondary
                ?.platform,
        };
        athleteDTO.status = {
            id: athleteDetails.dashapp_athlete_status?.id.toString(),
            name: athleteDetails.dashapp_athlete_status?.status,
        };
        athleteDTO.state = {
            id: athleteDetails.dashapp_states?.id.toString(),
            name: athleteDetails.dashapp_states?.state,
        };

        return athleteDTO;
    }
}
