import { Prisma } from "@prisma/client";
import { TTeamDetails } from "../types/team.type.js";

export class TeamResponseDTO {
    id?: string;
    name?: string;
    owners?: {
        id?: string;
        name?: string;
    }[];
    sport?: {
        id?: string;
        name?: string;
    };
    league?: {
        id?: string;
        name?: string;
    };
    yearOfInception?: string | null;
    franchiseFee?: Prisma.Decimal | null;
    city?: {
        id?: string;
        name?: string;
    };
    state?: {
        id?: string;
        name?: string;
    };
    createdBy?: {
        id?: string;
        name?: string;
    };
    modifiedBy?: {
        id?: string;
        name?: string;
    };
    createdDate?: Date | null;
    modifiedDate?: Date | null;
    instagram?: string | null;
    facebook?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    youtube?: string | null;
    website?: string | null;
    strategyOverview?: string | null;
    taglines?: {
        id?: string;
        name?: string;
    }[];
    endorsements?: {
        id?: string;
        name?: string;
        active?: boolean;
    }[];
    activeCampaigns?: {
        id?: string;
        name?: string;
    }[];
    primaryMarketingPlatform?: {
        id?: string;
        name?: string;
    }[];
    secondaryMarketingPlatform?: {
        id?: string;
        name?: string;
    }[];
    age?: {
        id?: string;
        name?: string;
    }[];
    gender?: {
        id?: string;
        name?: string;
    }[];
    nccs?: {
        id?: string;
        name?: string;
    }[];
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
    association?: {
        associationId?: string;
        associationLevel?: {
            id?: string;
            name?: string | null;
        };
        brand?: {
            id?: string;
            name?: string | null;
        }[];
        costOfAssociation?: Prisma.Decimal | null;
    }[];
    tiers?: {
        id?: string;
        name?: string;
    }[];
    mainPersonalityTraits?: {
        id?: string;
        name?: string;
        subPersonalityTraits?: {
            id?: string;
            name?: string;
        }[];
    }[];
    sportsDealSummary?: {
        annualValue: Prisma.Decimal | null;
        assets: {
            id?: string;
            name?: string;
        }[];
        commencementDate: string | null;
        duration: string | null;
        expirationDate: string | null;
        level: {
            id?: string;
            name?: string;
        };
        mediaLink: string | null;
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
        brandName?: {
            id?: string;
            name?: string;
        };
        status: string | null;
        territory?: {
            id?: string;
            name?: string;
        };
        totalValue: Prisma.Decimal | null;
        type: string;
    }[];
    activationSummary?: {
        asset: {
            id?: string;
            name?: string;
        }[];
        market: {
            id?: string;
            name?: string;
        }[];
        name: string | null;
        type: {
            id?: string;
            name?: string;
        }[];
        year: string | null;
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
        brandName?: {
            id?: string;
            name?: string;
        };
    }[];
    contactPersons?: {
        contactId: string;
        contactName: string;
        contactDesignation: string | null;
        contactEmail: string | null;
        contactNumber: string | null;
        contactLinkedin: string | null;
    }[];
    ottPartnerMetrics?: {
        id: string;
        viewership: string | null;
        reach: string | null;
        year: string;
        ottPartner: { id: string; name: string };
    }[];
    broadcastPartnerMetrics?: {
        id: string;
        reach: string | null;
        viewership: string | null;
        year: string;
        broadcastPartner: { id: string; name: string };
    }[];

    static toResponse(teamDetails: TTeamDetails): TeamResponseDTO {
        const teamDTO = new TeamResponseDTO();
        (teamDTO.id = teamDetails.id.toString()),
            (teamDTO.name = teamDetails.team_name);
        teamDTO.owners = teamDetails.dashapp_team_owner.map((owner) => ({
            id: owner.dashapp_teamowner.id.toString(),
            name: owner.dashapp_teamowner.name,
        }));
        teamDTO.sport = {
            id: teamDetails.dashapp_sport?.id.toString(),
            name: teamDetails.dashapp_sport?.name,
        };
        teamDTO.league = {
            id: teamDetails.dashapp_leagueinfo?.id.toString(),
            name: teamDetails.dashapp_leagueinfo?.property_name,
        };
        (teamDTO.yearOfInception = teamDetails.year_of_inception),
            (teamDTO.franchiseFee = teamDetails.franchise_fee);
        teamDTO.city = {
            id: teamDetails.dashapp_hqcity?.id.toString(),
            name: teamDetails.dashapp_hqcity?.name,
        };
        teamDTO.state = {
            id: teamDetails.dashapp_states?.id.toString(),
            name: teamDetails.dashapp_states?.state,
        };
        teamDTO.instagram = teamDetails.instagram;
        teamDTO.facebook = teamDetails.facebook;
        teamDTO.twitter = teamDetails.twitter;
        teamDTO.linkedin = teamDetails.linkedin;
        teamDTO.youtube = teamDetails.youtube;
        teamDTO.website = teamDetails.website;
        teamDTO.strategyOverview = teamDetails.strategy_overview;
        teamDTO.taglines = teamDetails.dashapp_team_taglines.map((tagline) => ({
            id: tagline.dashapp_taglines.id.toString(),
            name: tagline.dashapp_taglines.name,
        }));
        teamDTO.endorsements = teamDetails.dashapp_teamendorsements.map(
            (endorse) => ({
                id: endorse.id.toString(),
                name: endorse.name,
                active: endorse.active,
            }),
        );
        teamDTO.activeCampaigns = teamDetails.dashapp_team_active_campaigns.map(
            (activeCampaign) => ({
                id: activeCampaign.dashapp_activecampaigns.id.toString(),
                name: activeCampaign.dashapp_activecampaigns.name,
            }),
        );
        teamDTO.primaryMarketingPlatform =
            teamDetails.dashapp_team_marketing_platforms_primary.map(
                (platform) => ({
                    id: platform.dashapp_marketingplatform.id.toString(),
                    name: platform.dashapp_marketingplatform.platform,
                }),
            );
        teamDTO.secondaryMarketingPlatform =
            teamDetails.dashapp_team_marketing_platforms_secondary.map(
                (platform) => ({
                    id: platform.dashapp_marketingplatform.id.toString(),
                    name: platform.dashapp_marketingplatform.platform,
                }),
            );
        teamDTO.age = teamDetails.dashapp_team_age.map((age) => ({
            id: age.dashapp_age?.id.toString(),
            name: age.dashapp_age?.age_range,
        }));
        teamDTO.gender = teamDetails.dashapp_team_gender.map((gender) => ({
            id: gender.dashapp_gender?.id.toString(),
            name: gender.dashapp_gender?.gender_is,
        }));
        teamDTO.nccs = teamDetails.dashapp_team_income.map((nccs) => ({
            id: nccs.dashapp_nccs?.id.toString(),
            name: nccs.dashapp_nccs?.nccs_class,
        }));
        teamDTO.primaryKeyMarket =
            teamDetails.dashapp_team_key_markets_primary.map((market) => ({
                id: market.dashapp_keymarket.id.toString(),
                name: market.dashapp_keymarket.zone,
            }));
        teamDTO.secondaryKeyMarket =
            teamDetails.dashapp_team_key_markets_secondary.map((market) => ({
                id: market.dashapp_keymarket.id.toString(),
                name: market.dashapp_keymarket.zone,
            }));
        teamDTO.tertiary = teamDetails.dashapp_team_key_markets_tertiary.map(
            (state) => ({
                id: state.dashapp_states.id.toString(),
                name: state.dashapp_states.state,
            }),
        );
        teamDTO.createdBy = {
            id: teamDetails.created_by?.id.toString(),
            name: teamDetails.created_by?.email,
        };
        teamDTO.modifiedBy = {
            id: teamDetails.modified_by?.id.toString(),
            name: teamDetails.modified_by?.email,
        };
        teamDTO.createdDate = teamDetails.created_date;
        teamDTO.modifiedDate = teamDetails.modified_date;
        teamDTO.association = teamDetails.dashapp_team_association.map(
            (association) => ({
                associationId: association.id.toString(),
                associationLevel: {
                    id: association.association_level?.id.toString(),
                    name: association.association_level?.name,
                },
                costOfAssociation: association.cost,
                brand: association.dashapp_brand_association.map((brand) => ({
                    id: brand.brand?.id.toString(),
                    name: brand.brand?.company_name,
                })),
            }),
        );
        teamDTO.tiers = teamDetails.dashapp_team_tier.map((tier) => ({
            id: tier.dashapp_tier?.id.toString(),
            name: tier.dashapp_tier?.name,
        }));
        teamDTO.mainPersonalityTraits = teamDetails.mainPersonalities.map(
            (trait) => ({
                id: trait.id.toString(),
                name: trait.name,
                subPersonalityTraits: trait.dashapp_subpersonality.map(
                    (sub) => ({
                        id: sub.id.toString(),
                        name: sub.name,
                    }),
                ),
            }),
        );
        teamDTO.sportsDealSummary = teamDetails.dashapp_sportsdealsummary.map(
            (deal) => ({
                annualValue: deal.annual_value,
                assets: deal.dashapp_sportsdeal_assets.map((assest) => ({
                    id: assest.dashapp_assets.id.toString(),
                    name: assest.dashapp_assets.asset,
                })),
                commencementDate: deal.commencement_date,
                duration: deal.duration,
                expirationDate: deal.expiration_date,
                level: {
                    id: deal.dashapp_level?.id.toString(),
                    name: deal.dashapp_level?.name,
                },
                mediaLink: deal.media_link,
                brandName: {
                    id: deal.dashapp_companydata?.id.toString(),
                    name: deal.dashapp_companydata?.company_name,
                },
                athleteName: {
                    id: deal.dashapp_athlete?.id.toString(),
                    name: deal.dashapp_athlete?.athlete_name,
                },
                leagueName: {
                    id: deal.dashapp_leagueinfo?.id.toString(),
                    name: deal.dashapp_leagueinfo?.property_name,
                },
                teamName: {
                    id: deal.dashapp_team?.id.toString(),
                    name: deal.dashapp_team?.team_name,
                },
                status: deal.status,
                territory: {
                    id: deal.dashapp_territory?.id.toString(),
                    name: deal.dashapp_territory?.name,
                },
                totalValue: deal.total_value,
                type: deal.type,
            }),
        );
        teamDTO.activationSummary = teamDetails.dashapp_activation.map(
            (activation) => ({
                asset: activation.dashapp_activation_assets.map((asset) => ({
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
                leagueName: {
                    id: activation.dashapp_leagueinfo?.id.toString(),
                    name: activation.dashapp_leagueinfo?.property_name,
                },
                teamName: {
                    id: activation.dashapp_team?.id.toString(),
                    name: activation.dashapp_team?.team_name,
                },
                name: activation.name,
                type: activation.dashapp_activation_type.map((type) => ({
                    id: type.dashapp_marketingplatform.id.toString(),
                    name: type.dashapp_marketingplatform.platform,
                })),
                year: activation.Year,
            }),
            (teamDTO.contactPersons = teamDetails.dashapp_teamcontact.map(
                (contact) => ({
                    contactId: contact.id.toString(),
                    contactDesignation: contact.contact_designation,
                    contactEmail: contact.contact_email,
                    contactLinkedin: contact.contact_linkedin,
                    contactName: contact.contact_name,
                    contactNumber: contact.contact_no,
                }),
            )),
        );
        teamDTO.ottPartnerMetrics = teamDetails.dashapp_ott_partner_metrics.map(
            (metric) => ({
                id: metric.id.toString(),
                viewership: metric.viewership,
                reach: metric.reach,
                year: metric.year,
                ottPartner: {
                    id: metric.dashapp_ottpartner.id.toString(),
                    name: metric.dashapp_ottpartner.name,
                },
            }),
        );
        teamDTO.broadcastPartnerMetrics =
            teamDetails.dashapp_broadcast_partner_metrics.map((metric) => ({
                id: metric.id.toString(),
                viewership: metric.viewership,
                reach: metric.reach,
                year: metric.year,
                broadcastPartner: {
                    id: metric.dashapp_broadcastpartner.id.toString(),
                    name: metric.dashapp_broadcastpartner.name,
                },
            }));

        return teamDTO;
    }
}
