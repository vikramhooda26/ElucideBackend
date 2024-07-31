import { Prisma } from "@prisma/client";

export const teamSelect = Prisma.validator<Prisma.dashapp_teamSelect>()({
    id: true,
    team_name: true,
    dashapp_team_owner: {
        select: {
            dashapp_teamowner: {
                select: {
                    name: true,
                },
            },
        },
    },
    dashapp_sport: {
        select: {
            name: true,
        },
    },
    dashapp_leagueinfo: {
        select: {
            property_name: true,
        },
    },
    year_of_inception: true,
    franchise_fee: true,
    dashapp_hqcity: {
        select: {
            name: true,
        },
    },
    dashapp_states: {
        select: {
            state: true,
        },
    },
    instagram: true,
    facebook: true,
    twitter: true,
    linkedin: true,
    youtube: true,
    website: true,
    strategy_overview: true,
    dashapp_team_taglines: {
        select: {
            dashapp_taglines: {
                select: {
                    name: true,
                },
            },
        },
    },
    dashapp_teamendorsements: {
        select: {
            name: true,
        },
    },
    dashapp_team_active_campaigns: {
        select: {
            dashapp_activecampaigns: {
                select: {
                    name: true,
                },
            },
        },
    },
    dashapp_team_marketing_platforms_primary: {
        select: {
            dashapp_marketingplatform: {
                select: {
                    platform: true,
                },
            },
        },
    },
    dashapp_team_marketing_platforms_secondary: {
        select: {
            dashapp_marketingplatform: {
                select: {
                    platform: true,
                },
            },
        },
    },
    dashapp_team_age: {
        select: {
            dashapp_age: {
                select: {
                    age_range: true,
                },
            },
        },
    },
    dashapp_team_gender: {
        select: {
            dashapp_gender: {
                select: { gender_is: true },
            },
        },
    },
    dashapp_team_income: {
        select: {
            dashapp_income: {
                select: {
                    income_class: true,
                },
            },
        },
    },
    dashapp_team_key_markets_primary: {
        select: {
            dashapp_keymarket: {
                select: {
                    zone: true,
                },
            },
        },
    },
    dashapp_team_key_markets_secondary: {
        select: {
            dashapp_keymarket: {
                select: {
                    zone: true,
                },
            },
        },
    },
    dashapp_team_key_markets_tertiary: {
        select: {
            dashapp_states: {
                select: {
                    state: true,
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
    dashapp_team_tier: {
        select: {
            dashapp_tier: {
                select: { name: true },
            },
        },
    },
    dashapp_team_personality_traits: {
        select: {
            dashapp_subpersonality: {
                select: {
                    name: true,
                    dashapp_mainpersonality: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    },
    dashapp_sportsdealsummary: {
        select: {
            dashapp_sportsdeal_assets: {
                select: {
                    dashapp_assets: {
                        select: {
                            asset: true,
                        },
                    },
                },
            },
            dashapp_companydata: {
                select: {
                    company_name: true,
                },
            },
            commencement_date: true,
            status: true,
            type: true,
            dashapp_level: {
                select: {
                    name: true,
                },
            },
            expiration_date: true,
            duration: true,
            annual_value: true,
            total_value: true,
            territory: true,
            media_link: true,
        },
    },
    dashapp_activation: {
        select: {
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
                        select: {
                            asset: true,
                        },
                    },
                },
            },
            dashapp_activation_market: {
                select: {
                    dashapp_states: {
                        select: {
                            state: true,
                        },
                    },
                },
            },
            dashapp_companydata: {
                select: {
                    company_name: true,
                },
            },
            Year: true,
        },
    },
    dashapp_teamcontact: {
        select: {
            contact_name: true,
            contact_designation: true,
            contact_email: true,
            contact_no: true,
            contact_linkedin: true,
        },
    },
    dashapp_metric: {
        select: {
            viewership: true,
            viewship_type: true,
            year: true,
            reach: true,
        },
    },
});

export type TTeamDetails = Prisma.dashapp_teamGetPayload<{
    select: typeof teamSelect;
}>;
