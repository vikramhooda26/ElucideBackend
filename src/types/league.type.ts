/**
 * Reference: https://stackoverflow.com/questions/68366105/get-full-type-on-prisma-client
 */

import { Prisma } from "@prisma/client";

export const leagueSelect = Prisma.validator<Prisma.dashapp_leagueinfoSelect>()(
    {
        property_name: true,
        dashapp_sport: {
            select: {
                name: true,
            },
        },
        dashapp_leagueinfo_owner: {
            select: {
                dashapp_leagueowner: {
                    select: {
                        name: true,
                    },
                },
            },
        },
        year_of_inception: true,
        dashapp_broadcastpartner: {
            select: {
                name: true,
            },
        },
        dashapp_ottpartner: {
            select: {
                name: true,
            },
        },
        format: {
            select: {
                format: true,
            },
        },
        instagram: true,
        facebook: true,
        linkedin: true,
        youtube: true,
        website: true,
        twitter: true,
        strategy_overview: true,
        dashapp_leagueinfo_taglines: {
            select: {
                dashapp_taglines: {
                    select: {
                        name: true,
                    },
                },
            },
        },
        dashapp_leagueinfo_active_campaigns: {
            select: {
                dashapp_activecampaigns: {
                    select: {
                        name: true,
                    },
                },
            },
        },
        dashapp_leagueinfo_key_markets_primary: {
            select: {
                dashapp_keymarket: {
                    select: {
                        zone: true,
                    },
                },
            },
        },
        dashapp_leagueinfo_key_markets_secondary: {
            select: {
                dashapp_keymarket: {
                    select: {
                        zone: true,
                    },
                },
            },
        },
        dashapp_leagueinfo_key_markets_tertiary: {
            select: {
                dashapp_states: {
                    select: {
                        state: true,
                    },
                },
            },
        },
        dashapp_leagueinfo_marketing_platforms_primary: {
            select: {
                dashapp_marketingplatform: {
                    select: {
                        platform: true,
                    },
                },
            },
        },
        dashapp_leagueinfo_marketing_platforms_secondary: {
            select: {
                dashapp_marketingplatform: {
                    select: {
                        platform: true,
                    },
                },
            },
        },
        association: {
            select: {
                cost: true,
                association_level: {
                    select: { name: true },
                },
            },
        },
        dashapp_leagueinfo_tier: {
            select: {
                dashapp_tier: {
                    select: {
                        name: true,
                    },
                },
            },
        },
        dashapp_leagueinfo_personality_traits: {
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
        dashapp_leagueendorsements: {
            select: {
                name: true,
                active: true,
            },
        },
        dashapp_leagueinfo_age: {
            select: {
                dashapp_age: {
                    select: {
                        age_range: true,
                    },
                },
            },
        },
        dashapp_leagueinfo_income: {
            select: {
                dashapp_income: {
                    select: {
                        income_class: true,
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
        dashapp_leaguecontact: {
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
    },
);

export type TLeagueDetails = Prisma.dashapp_leagueinfoGetPayload<{
    select: typeof leagueSelect;
}>;
