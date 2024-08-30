import { Prisma } from "@prisma/client";
import { TLeagueDetails } from "../types/league.type.js";

export class LeagueResponseDTO {
    id?: string;
    name?: string;
    sport?: {
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
    owners?: {
        id?: string;
        name?: string;
    }[];
    yearOfInception!: string | null;
    broadcastPartner?: {
        id?: string;
        name?: string;
    };
    ottPartner?: {
        id?: string;
        name?: string;
    };
    instagram!: string | null;
    facebook!: string | null;
    linkedin!: string | null;
    youtube!: string | null;
    website!: string | null;
    twitter!: string | null;
    strategyOverview!: string | null;
    taglines?: {
        id?: string;
        name?: string;
    }[];
    activeCampaigns?: {
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
    primaryMarketingPlatform?: {
        id?: string;
        name?: string;
    }[];
    secondaryMarketingPlatform?: {
        id?: string;
        name?: string;
    }[];
    association?: {
        associationId?: string;
        associationLevel?: {
            id?: string;
            name?: string | null;
        };
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
    team?: {
        id?: string;
        name?: string;
    }[];
    gender?: {
        id?: string;
        name?: string;
    }[];
    endorsements?: {
        id?: string;
        name?: string;
        active?: boolean;
    }[];
    format?: {
        id?: string;
        name?: string;
    };
    age?: {
        id?: string;
        name?: string;
    }[];
    nccs?: {
        id?: string;
        name?: string;
    }[];
    sportsDealSummary?: {
        id?: string;
        annualValue?: Prisma.Decimal | null;
        totalValue?: Prisma.Decimal | null;
        assets?: {
            id?: string;
            name?: string;
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
        brand?: {
            id?: string;
            name?: string;
        };
        athlete?: {
            id?: string;
            name?: string;
        };
        league?: {
            id?: string;
            name?: string;
        };
        team?: {
            id?: string;
            name?: string;
        };
    }[];
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
        brand?: {
            id?: string;
            name?: string;
        };
        athlete?: {
            id?: string;
            name?: string;
        };
        league?: {
            id?: string;
            name?: string;
        };
        team?: {
            id?: string;
            name?: string;
        };
    }[];
    contactPersons?: {
        contactId: string;
        contactName: string;
        contactEmail?: string | null;
        contactLinkedin?: string | null;
        contactNumber?: string | null;
        contactDesignation?: string | null;
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

    static toResponse(leagueDetails: TLeagueDetails): LeagueResponseDTO {
        const leagueDTO = new LeagueResponseDTO();
        (leagueDTO.id = leagueDetails.id.toString()),
            (leagueDTO.name = leagueDetails.property_name);
        leagueDTO.sport = {
            id: leagueDetails.dashapp_sport?.id.toString(),
            name: leagueDetails.dashapp_sport?.name,
        };
        leagueDTO.owners = leagueDetails.dashapp_leagueinfo_owner.map(
            (owner) => ({
                id: owner.dashapp_leagueowner.id.toString(),
                name: owner.dashapp_leagueowner.name,
            }),
        );
        leagueDTO.yearOfInception = leagueDetails.year_of_inception;
        leagueDTO.broadcastPartner = {
            id: leagueDetails.dashapp_broadcastpartner?.id.toString(),
            name: leagueDetails.dashapp_broadcastpartner?.name,
        };
        leagueDTO.ottPartner = {
            id: leagueDetails.dashapp_ottpartner?.id.toString(),
            name: leagueDetails.dashapp_ottpartner?.name,
        };
        leagueDTO.instagram = leagueDetails.instagram;
        leagueDTO.facebook = leagueDetails.facebook;
        leagueDTO.linkedin = leagueDetails.linkedin;
        leagueDTO.youtube = leagueDetails.youtube;
        leagueDTO.website = leagueDetails.website;
        leagueDTO.twitter = leagueDetails.twitter;
        leagueDTO.strategyOverview = leagueDetails.strategy_overview;
        leagueDTO.taglines = leagueDetails.dashapp_leagueinfo_taglines.map(
            (tagline) => ({
                id: tagline.dashapp_taglines.id.toString(),
                name: tagline.dashapp_taglines.name,
            }),
        );
        leagueDTO.tiers = leagueDetails.dashapp_leagueinfo_tier.map((tier) => ({
            id: tier.dashapp_tier?.id.toString(),
            name: tier.dashapp_tier?.name,
        }));
        leagueDTO.createdBy = {
            id: leagueDetails.created_by?.id.toString(),
            name: leagueDetails.created_by?.email,
        };
        leagueDTO.modifiedBy = {
            id: leagueDetails.modified_by?.id.toString(),
            name: leagueDetails.modified_by?.email,
        };
        leagueDTO.createdDate = leagueDetails.created_date;
        leagueDTO.modifiedDate = leagueDetails.modified_date;
        leagueDTO.gender = leagueDetails.dashapp_leagueinfo_gender.map(
            (gender) => ({
                id: gender.dashapp_gender.id.toString(),
                name: gender.dashapp_gender.gender_is,
            }),
        );
        leagueDTO.team = leagueDetails.dashapp_team.map((team) => ({
            id: team.id.toString(),
            name: team.team_name,
        }));
        leagueDTO.format = {
            id: leagueDetails.format?.id.toString(),
            name: leagueDetails.format?.format,
        };
        leagueDTO.activeCampaigns =
            leagueDetails.dashapp_leagueinfo_active_campaigns.map(
                (activeCampaign) => ({
                    id: activeCampaign.dashapp_activecampaigns.id.toString(),
                    name: activeCampaign.dashapp_activecampaigns.name,
                }),
            );
        leagueDTO.primaryKeyMarket =
            leagueDetails.dashapp_leagueinfo_key_markets_primary.map(
                (market) => ({
                    id: market.dashapp_keymarket.id.toString(),
                    name: market.dashapp_keymarket.zone,
                }),
            );
        leagueDTO.secondaryKeyMarket =
            leagueDetails.dashapp_leagueinfo_key_markets_secondary.map(
                (market) => ({
                    id: market.dashapp_keymarket.id.toString(),
                    name: market.dashapp_keymarket.zone,
                }),
            );
        leagueDTO.tertiary =
            leagueDetails.dashapp_leagueinfo_key_markets_tertiary.map(
                (state) => ({
                    id: state.dashapp_states.id.toString(),
                    name: state.dashapp_states.state,
                }),
            );
        leagueDTO.primaryMarketingPlatform =
            leagueDetails.dashapp_leagueinfo_marketing_platforms_primary.map(
                (platform) => ({
                    id: platform.dashapp_marketingplatform.id.toString(),
                    name: platform.dashapp_marketingplatform.platform,
                }),
            );
        leagueDTO.secondaryMarketingPlatform =
            leagueDetails.dashapp_leagueinfo_marketing_platforms_secondary.map(
                (platform) => ({
                    id: platform.dashapp_marketingplatform.id.toString(),
                    name: platform.dashapp_marketingplatform.platform,
                }),
            );
        leagueDTO.association =
            leagueDetails.dashapp_leagueinfo_association.map((association) => ({
                associationId: association.id.toString(),
                associationLevel: {
                    id: association.association_level?.id.toString(),
                    name: association.association_level?.name,
                },
                costOfAssociation: association.cost,
            }));
        leagueDTO.mainPersonalityTraits = leagueDetails.mainPersonalities.map(
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
        leagueDTO.endorsements = leagueDetails.dashapp_leagueendorsements.map(
            (endorse) => ({
                id: endorse.id.toString(),
                name: endorse.name,
                active: endorse.active,
            }),
        );
        leagueDTO.age = leagueDetails.dashapp_leagueinfo_age.map((age) => ({
            id: age.dashapp_age?.id.toString(),
            name: age.dashapp_age?.age_range,
        }));
        leagueDTO.nccs = leagueDetails.dashapp_leagueinfo_income.map(
            (nccs) => ({
                id: nccs.dashapp_nccs.id.toString(),
                name: nccs.dashapp_nccs.nccs_class,
            }),
        );
        leagueDTO.sportsDealSummary =
            leagueDetails.dashapp_sportsdealsummary.map((deal) => ({
                id: deal.id.toString(),
                annualValue: deal.annual_value,
                assets: deal.dashapp_sportsdeal_assets.map((asset) => ({
                    id: asset.dashapp_assets.id.toString(),
                    name: asset.dashapp_assets.asset,
                })),
                commencementDate: deal.commencement_date,
                duration: deal.duration,
                expirationDate: deal.expiration_date,
                level: {
                    id: deal.dashapp_level?.id.toString(),
                    name: deal.dashapp_level?.name,
                },
                mediaLink: deal.media_link,
                brand: {
                    id: deal.dashapp_companydata?.id.toString(),
                    name: deal.dashapp_companydata?.company_name,
                },
                athlete: {
                    id: deal.dashapp_athlete?.id.toString(),
                    name: deal.dashapp_athlete?.athlete_name,
                },
                league: {
                    id: deal.dashapp_leagueinfo?.id.toString(),
                    name: deal.dashapp_leagueinfo?.property_name,
                },
                team: {
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
            }));
        leagueDTO.activations = leagueDetails.dashapp_activation.map(
            (activation) => ({
                id: activation.id.toString(),
                asset: activation.dashapp_activation_assets.map((asset) => ({
                    id: asset.dashapp_assets.id.toString(),
                    name: asset.dashapp_assets.asset,
                })),
                market: activation.dashapp_activation_market.map((market) => ({
                    id: market.dashapp_states.id.toString(),
                    name: market.dashapp_states.state,
                })),
                name: activation.name,
                type: activation.dashapp_activation_type.map((type) => ({
                    id: type.dashapp_marketingplatform.id.toString(),
                    name: type.dashapp_marketingplatform.platform,
                })),
                brand: {
                    id: activation.dashapp_companydata?.id.toString(),
                    name: activation.dashapp_companydata?.company_name,
                },
                athlete: {
                    id: activation.dashapp_athlete?.id.toString(),
                    name: activation.dashapp_athlete?.athlete_name,
                },
                league: {
                    id: activation.dashapp_leagueinfo?.id.toString(),
                    name: activation.dashapp_leagueinfo?.property_name,
                },
                team: {
                    id: activation.dashapp_team?.id.toString(),
                    name: activation.dashapp_team?.team_name,
                },
                year: activation.Year,
            }),
            (leagueDTO.contactPersons = leagueDetails.dashapp_leaguecontact.map(
                (contact) => ({
                    contactId: contact.id.toString(),
                    contactName: contact.contact_name,
                    contactDesignation: contact.contact_designation,
                    contactEmail: contact.contact_email,
                    contactLinkedin: contact.contact_linkedin,
                    contactNumber: contact.contact_no,
                }),
            )),
        );
        leagueDTO.ottPartnerMetrics =
            leagueDetails.dashapp_ott_partner_metrics.map((metric) => ({
                id: metric.id.toString(),
                viewership: metric.viewership,
                reach: metric.reach,
                year: metric.year,
                ottPartner: {
                    id: metric.dashapp_ottpartner.id.toString(),
                    name: metric.dashapp_ottpartner.name,
                },
            }));
        leagueDTO.broadcastPartnerMetrics =
            leagueDetails.dashapp_broadcast_partner_metrics.map((metric) => ({
                id: metric.id.toString(),
                reach: metric?.reach,
                viewership: metric.viewership,
                year: metric?.year,
                broadcastPartner: {
                    id: metric.dashapp_broadcastpartner.id.toString(),
                    name: metric.dashapp_broadcastpartner.name,
                },
            }));

        return leagueDTO;
    }
}
