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
        select: { dashapp_socialmedia_platform: { select: { name: true } } },
    },
    dashapp_athlete_socialmedia_platform_secondary: {
        select: { dashapp_socialmedia_platform: { select: { name: true } } },
    },
    nationality: { select: { name: true } },
    dashapp_sport: {
        select: {
            name: true,
        },
    },
    dashapp_agency: {
        select: {
            name: true,
        },
    },
    dashapp_athlete_key_markets_primary: {
        select: {
            dashapp_keymarket: {
                select: {
                    zone: true,
                },
            },
        },
    },
    dashapp_athlete_key_markets_secondary: {
        select: {
            dashapp_keymarket: {
                select: {
                    zone: true,
                },
            },
        },
    },
    dashapp_athlete_key_markets_tertiary: {
        select: {
            dashapp_states: {
                select: {
                    state: true,
                },
            },
        },
    },
    dashapp_athlete_tier: {
        select: {
            dashapp_tier: {
                select: { name: true },
            },
        },
    },
    dashapp_athlete_personality_traits: {
        select: {
            dashapp_subpersonality: {
                select: {
                    name: true,
                    dashapp_mainpersonality: {
                        select: { name: true },
                    },
                },
            },
        },
    },
    association: {
        select: {
            association_level: {
                select: {
                    name: true,
                },
            },
            cost: true,
        },
    },
    dashapp_activation: {
        select: {
            Year: true,
            name: true,
            dashapp_activation_type: {
                select: {
                    dashapp_marketingplatform: {
                        select: {
                            platform: true,
                        },
                    },
                },
            },
            dashapp_activation_assets: {
                select: {
                    dashapp_assets: {
                        select: { asset: true },
                    },
                },
            },
            dashapp_activation_market: {
                select: { dashapp_states: { select: { state: true } } },
            },
            dashapp_companydata: {
                select: { company_name: true },
            },
        },
    },
    dashapp_sportsdealsummary: {
        select: {
            annual_value: true,
            total_value: true,
            dashapp_sportsdeal_assets: {
                select: { dashapp_assets: { select: { asset: true } } },
            },
            commencement_date: true,
            expiration_date: true,
            duration: true,
            dashapp_territory: { select: { name: true } },
            media_link: true,
            dashapp_level: { select: { name: true } },
            status: true,
            type: true,
            dashapp_companydata: { select: { company_name: true } },
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
        select: { dashapp_gender: { select: { gender_is: true } } },
    },
    dashapp_athlete_target_income: {
        select: { dashapp_nccs: { select: { nccs_class: true } } },
    },
    dashapp_athlete_keyplatform_primary: { select: { platform: true } },
    dashapp_athlete_keyplatform_secondary: { select: { platform: true } },
    dashapp_athlete_status: { select: { status: true } },
    dashapp_states: { select: { state: true } },
});

export type TAthleteDetails = Prisma.dashapp_athleteGetPayload<{
    select: typeof athleteSelect;
}>;
