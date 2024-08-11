import { Prisma } from "@prisma/client";

export const athleteSelect = Prisma.validator<Prisma.dashapp_athleteSelect>()({
    id: true,
    athlete_name: true,
    instagram: true,
    linkedin: true,
    youtube: true,
    website: true,
    twitter: true,
    facebook: true,
    age: true,
    dashapp_athlete_socialmedia_platform_primary: {
        select: {
            dashapp_socialmedia_platform: { select: { id: true, name: true } },
        },
    },
    dashapp_athlete_socialmedia_platform_secondary: {
        select: {
            dashapp_socialmedia_platform: { select: { name: true, id: true } },
        },
    },
    nationality: { select: { name: true, id: true } },
    dashapp_sport: {
        select: {
            id: true,
            name: true,
        },
    },
    dashapp_agency: {
        select: {
            id: true,
            name: true,
        },
    },
    dashapp_athlete_key_markets_primary: {
        select: {
            dashapp_keymarket: {
                select: {
                    id: true,
                    zone: true,
                },
            },
        },
    },
    dashapp_athlete_key_markets_secondary: {
        select: {
            dashapp_keymarket: {
                select: {
                    id: true,
                    zone: true,
                },
            },
        },
    },
    dashapp_athlete_key_markets_tertiary: {
        select: {
            dashapp_states: {
                select: {
                    id: true,
                    state: true,
                },
            },
        },
    },
    dashapp_athlete_tier: {
        select: {
            dashapp_tier: {
                select: { id: true, name: true },
            },
        },
    },
    dashapp_athlete_personality_traits: {
        select: {
            dashapp_subpersonality: {
                select: {
                    id: true,
                    name: true,
                    dashapp_mainpersonality: {
                        select: { id: true, name: true },
                    },
                },
            },
        },
    },
    association: {
        select: {
            id: true,
            association_level: {
                select: {
                    id: true,
                    name: true,
                },
            },
            cost: true,
        },
    },
    dashapp_activation: {
        select: {
            id: true,
            Year: true,
            name: true,
            dashapp_activation_type: {
                select: {
                    dashapp_marketingplatform: {
                        select: {
                            id: true,
                            platform: true,
                        },
                    },
                },
            },
            dashapp_activation_assets: {
                select: {
                    dashapp_assets: {
                        select: { id: true, asset: true },
                    },
                },
            },
            dashapp_activation_market: {
                select: {
                    dashapp_states: { select: { id: true, state: true } },
                },
            },
            dashapp_companydata: { select: { id: true, company_name: true } },
            dashapp_athlete: { select: { id: true, athlete_name: true } },
            dashapp_leagueinfo: { select: { id: true, property_name: true } },
            dashapp_team: { select: { id: true, team_name: true } },
        },
    },
    dashapp_sportsdealsummary: {
        select: {
            id: true,
            annual_value: true,
            total_value: true,
            dashapp_sportsdeal_assets: {
                select: {
                    dashapp_assets: { select: { id: true, asset: true } },
                },
            },
            commencement_date: true,
            expiration_date: true,
            duration: true,
            dashapp_territory: { select: { id: true, name: true } },
            media_link: true,
            dashapp_level: { select: { id: true, name: true } },
            status: true,
            type: true,
            dashapp_companydata: { select: { id: true, company_name: true } },
            dashapp_athlete: { select: { id: true, athlete_name: true } },
            dashapp_leagueinfo: { select: { id: true, property_name: true } },
            dashapp_team: { select: { id: true, team_name: true } },
        },
    },
    dashapp_athletecontact: {
        select: {
            id: true,
            contact_name: true,
            contact_email: true,
            contact_linkedin: true,
            contact_no: true,
            contact_designation: true,
        },
    },
    dashapp_athlete_target_gender: {
        select: { dashapp_gender: { select: { id: true, gender_is: true } } },
    },
    dashapp_athlete_target_income: {
        select: { dashapp_nccs: { select: { id: true, nccs_class: true } } },
    },
    dashapp_athlete_keyplatform_primary: {
        select: { id: true, platform: true },
    },
    dashapp_athlete_keyplatform_secondary: {
        select: { id: true, platform: true },
    },
    dashapp_athlete_status: { select: { id: true, status: true } },
    dashapp_states: { select: { id: true, state: true } },
});

export type TAthleteDetails = Prisma.dashapp_athleteGetPayload<{
    select: typeof athleteSelect;
}>;
