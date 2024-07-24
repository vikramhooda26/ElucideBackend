import { Prisma } from "@prisma/client";

export const brandSelect = Prisma.validator<Prisma.dashapp_companydataSelect>()(
    {
        company_name: true,
        dashapp_parentorg: {
            select: {
                name: true,
            },
        },
        dashapp_companydata_subcategory: {
            select: {
                dashapp_subcategory: {
                    select: {
                        subcategory: true,
                        category: {
                            select: {
                                category: true,
                            },
                        },
                    },
                },
            },
        },
        dashapp_hqcity: {
            select: {
                name: true,
            },
        },
        hq_state: {
            select: {
                state: true,
            },
        },
        dashapp_agency: {
            select: {
                name: true,
            },
        },
        dashapp_companydata_tier: {
            select: {
                dashapp_tier: {
                    select: {
                        name: true,
                    },
                },
            },
        },
        instagram: true,
        facebook: true,
        twitter: true,
        linkedin: true,
        youtube: true,
        website: true,
        dashapp_companydata_personality_traits: {
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
        strategy_overview: true,
        dashapp_companydata_taglines: {
            select: { dashapp_taglines: { select: { name: true } } },
        },
        dashapp_companydata_active_campaigns: {
            select: { dashapp_activecampaigns: { select: { name: true } } },
        },
        dashapp_companydata_marketing_platforms_primary: {
            select: {
                dashapp_marketingplatform: {
                    select: {
                        platform: true,
                    },
                },
            },
        },
        dashapp_companydata_marketing_platforms_secondary: {
            select: {
                dashapp_marketingplatform: {
                    select: {
                        platform: true,
                    },
                },
            },
        },
        dashapp_companydata_age: {
            select: {
                dashapp_age: {
                    select: {
                        age_range: true,
                    },
                },
            },
        },
        dashapp_companydata_gender: {
            select: {
                dashapp_gender: {
                    select: { gender_is: true },
                },
            },
        },
        dashapp_companydata_income: {
            select: {
                dashapp_income: {
                    select: {
                        income_class: true,
                    },
                },
            },
        },
        dashapp_companydata_key_markets_primary: {
            select: {
                dashapp_keymarket: {
                    select: {
                        zone: true,
                    },
                },
            },
        },
        dashapp_companydata_key_markets_secondary: {
            select: {
                dashapp_keymarket: {
                    select: {
                        zone: true,
                    },
                },
            },
        },
        dashapp_companydata_key_markets_tertiary: {
            select: {
                dashapp_states: {
                    select: {
                        state: true,
                    },
                },
            },
        },
        dashapp_brandendorsements: {
            select: {
                name: true,
            },
        },
        dashapp_sportsdealsummary: {
            select: {
                annual_value: true,
                dashapp_athlete: {
                    select: {
                        athlete_name: true,
                    },
                },
                dashapp_leagueinfo: {
                    select: {
                        property_name: true,
                    },
                },
                dashapp_team: {
                    select: {
                        team_name: true,
                    },
                },
                type: true,
                status: true,
                dashapp_level: {
                    select: {
                        name: true,
                    },
                },
                commencement_date: true,
                expiration_date: true,
                duration: true,
                total_value: true,
                territory: true,
                media_link: true,
                assets: {
                    select: {
                        dashapp_assets: {
                            select: {
                                asset: true,
                            },
                        },
                    },
                },
            },
        },
        dashapp_activation: {
            select: {
                dashapp_team: {
                    select: { team_name: true },
                },
                dashapp_athlete: {
                    select: {
                        athlete_name: true,
                    },
                },
                dashapp_leagueinfo: {
                    select: {
                        property_name: true,
                    },
                },
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
                dashapp_activation_market: {
                    select: {
                        dashapp_states: {
                            select: {
                                state: true,
                            },
                        },
                    },
                },
                Year: true,
                dashapp_activation_assets: {
                    select: {
                        dashapp_assets: {
                            select: { asset: true },
                        },
                    },
                },
            },
        },
        dashapp_brandcontact: {
            select: {
                contact_name: true,
                contact_designation: true,
                contact_email: true,
                contact_linkedin: true,
                contact_no: true,
            },
        },
    },
);

export type TBrandDetails = Prisma.dashapp_companydataGetPayload<{
    select: typeof brandSelect;
}>;
