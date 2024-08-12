import { Prisma } from "@prisma/client";

export const brandSelect = Prisma.validator<Prisma.dashapp_companydataSelect>()(
    {
        id: true,
        company_name: true,
        dashapp_parentorg: {
            select: {
                id: true,
                name: true,
            },
        },
        dashapp_companydata_subcategory: {
            select: {
                dashapp_subcategory: {
                    select: {
                        id: true,
                        subcategory: true,
                        dashapp_category: {
                            select: { id: true, category: true },
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
        dashapp_hqcity: {
            select: {
                id: true,
                name: true,
            },
        },
        dashapp_states: {
            select: {
                id: true,
                state: true,
            },
        },
        dashapp_agency: {
            select: {
                id: true,
                name: true,
            },
        },
        dashapp_companydata_tier: {
            select: {
                dashapp_tier: {
                    select: {
                        id: true,
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
                        id: true,
                        name: true,
                        dashapp_mainpersonality: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        },
        strategy_overview: true,
        dashapp_companydata_taglines: {
            select: { dashapp_taglines: { select: { id: true, name: true } } },
        },
        dashapp_companydata_active_campaigns: {
            select: {
                dashapp_activecampaigns: { select: { id: true, name: true } },
            },
        },
        dashapp_companydata_marketing_platforms_primary: {
            select: {
                dashapp_marketingplatform: {
                    select: {
                        id: true,
                        platform: true,
                    },
                },
            },
        },
        dashapp_companydata_marketing_platforms_secondary: {
            select: {
                dashapp_marketingplatform: {
                    select: {
                        id: true,
                        platform: true,
                    },
                },
            },
        },
        dashapp_companydata_age: {
            select: {
                dashapp_age: {
                    select: {
                        id: true,
                        age_range: true,
                    },
                },
            },
        },
        dashapp_companydata_gender: {
            select: {
                dashapp_gender: {
                    select: { id: true, gender_is: true },
                },
            },
        },
        dashapp_companydata_income: {
            select: {
                dashapp_nccs: {
                    select: {
                        id: true,
                        nccs_class: true,
                    },
                },
            },
        },
        dashapp_companydata_key_markets_primary: {
            select: {
                dashapp_keymarket: {
                    select: {
                        id: true,
                        zone: true,
                    },
                },
            },
        },
        dashapp_companydata_key_markets_secondary: {
            select: {
                dashapp_keymarket: {
                    select: {
                        id: true,
                        zone: true,
                    },
                },
            },
        },
        dashapp_companydata_key_markets_tertiary: {
            select: {
                dashapp_states: {
                    select: {
                        id: true,
                        state: true,
                    },
                },
            },
        },
        dashapp_brandendorsements: {
            select: {
                id: true,
                name: true,
            },
        },
        dashapp_sportsdealsummary: {
            select: {
                id: true,
                annual_value: true,
                dashapp_athlete: {
                    select: {
                        id: true,
                        athlete_name: true,
                    },
                },
                dashapp_leagueinfo: {
                    select: {
                        id: true,
                        property_name: true,
                    },
                },
                dashapp_team: {
                    select: {
                        id: true,
                        team_name: true,
                    },
                },
                type: true,
                status: true,
                dashapp_level: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                dashapp_companydata: {
                    select: {
                        id: true,
                        company_name: true,
                    },
                },
                commencement_date: true,
                expiration_date: true,
                duration: true,
                total_value: true,
                dashapp_territory: { select: { id: true, name: true } },
                media_link: true,
                dashapp_sportsdeal_assets: {
                    select: {
                        dashapp_assets: {
                            select: {
                                id: true,
                                asset: true,
                            },
                        },
                    },
                },
            },
        },
        dashapp_activation: {
            select: {
                id: true,
                dashapp_team: {
                    select: { id: true, team_name: true },
                },
                dashapp_athlete: {
                    select: {
                        id: true,
                        athlete_name: true,
                    },
                },
                dashapp_leagueinfo: {
                    select: {
                        id: true,
                        property_name: true,
                    },
                },
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
                dashapp_activation_market: {
                    select: {
                        dashapp_states: {
                            select: {
                                id: true,
                                state: true,
                            },
                        },
                    },
                },
                dashapp_companydata: {
                    select: {
                        id: true,
                        company_name: true,
                    },
                },
                Year: true,
                dashapp_activation_assets: {
                    select: {
                        dashapp_assets: {
                            select: { id: true, asset: true },
                        },
                    },
                },
            },
        },
        dashapp_brandcontact: {
            select: {
                id: true,
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
