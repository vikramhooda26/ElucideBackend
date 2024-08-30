import { Prisma } from "@prisma/client";
import { TBrandDetails } from "../types/brand.type.js";

export class BrandResponseDTO {
    id?: string;
    name?: string;
    parentOrg?: {
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
    subcategory?: {
        id?: string;
        name?: string;
    }[];
    maincategory?: {
        id?: string;
        name?: string;
    }[];
    city?: {
        id?: string;
        name?: string;
    };
    state?: {
        id?: string;
        name?: string;
    };
    agency?: {
        id?: string;
        name?: string;
    };
    tier?: {
        id?: string;
        name?: string;
    }[];
    association?: {
        associationLevelId?: {
            id?: string;
            name?: string | null;
        };
        costOfAssociation?: Prisma.Decimal | null;
        team: {
            id?: string;
            name?: string;
        };
    }[];
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
    mainPersonalityTraits?: {
        id?: string;
        name?: string;
        subPersonalityTraits?: {
            id?: string;
            name?: string;
        }[];
    }[];
    mainCategories?: {
        id?: string;
        name?: string;
        subCategories?: {
            id?: string;
            name?: string;
        }[];
    }[];
    sportsDealSummary?: {
        id?: string;
        annualValue?: string;
        assets: {
            id?: string;
            name?: string;
        }[];
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
        commencementDate: string | null;
        duration: string | null;
        expirationDate: string | null;
        level: {
            id?: string;
            name?: string;
        };
        mediaLink: string | null;
        brand?: {
            id?: string;
            name?: string;
        };
        status: string | null;
        territory?: {
            id?: string;
            name?: string;
        };
        totalValue?: string;
        type: string;
    }[];
    activations?: {
        id?: string;
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
        name: string | null;
        type: {
            id?: string;
            name?: string;
        }[];
        market: {
            id?: string;
            name?: string;
        }[];
        year: string | null;
        asset: {
            id?: string;
            name?: string;
        }[];
    }[];
    contactPersons?: {
        contactId: string;
        contactName: string;
        contactDesignation: string | null;
        contactEmail: string | null;
        contactNumber: string | null;
        contactLinkedin: string | null;
    }[];

    static toResponse(brandDetails: TBrandDetails): BrandResponseDTO {
        const brandDTO = new BrandResponseDTO();
        (brandDTO.id = brandDetails.id.toString()),
            (brandDTO.name = brandDetails.company_name);
        brandDTO.parentOrg = {
            id: brandDetails.dashapp_parentorg?.id.toString(),
            name: brandDetails.dashapp_parentorg?.name,
        };
        brandDTO.mainCategories = brandDetails.mainCategories?.map(
            (category) => ({
                id: category.id?.toString(),
                name: category?.category,
                subCategories: category.dashapp_subcategory?.map(
                    (subCategory) => ({
                        id: subCategory.id?.toString(),
                        name: subCategory.subcategory,
                    }),
                ),
            }),
        );
        brandDTO.city = {
            id: brandDetails.dashapp_hqcity?.id.toString(),
            name: brandDetails.dashapp_hqcity?.name,
        };
        brandDTO.state = {
            id: brandDetails.dashapp_states?.id.toString(),
            name: brandDetails.dashapp_states?.state,
        };
        brandDTO.agency = {
            id: brandDetails.dashapp_agency?.id.toString(),
            name: brandDetails.dashapp_agency?.name,
        };
        brandDTO.tier = brandDetails.dashapp_companydata_tier.map((tier) => ({
            id: tier.dashapp_tier?.id.toString(),
            name: tier.dashapp_tier?.name,
        }));
        brandDTO.instagram = brandDetails.instagram;
        brandDTO.facebook = brandDetails.facebook;
        brandDTO.twitter = brandDetails.twitter;
        brandDTO.linkedin = brandDetails.linkedin;
        brandDTO.youtube = brandDetails.youtube;
        brandDTO.website = brandDetails.website;
        brandDTO.strategyOverview = brandDetails.strategy_overview;
        brandDTO.taglines = brandDetails.dashapp_companydata_taglines.map(
            (tagline) => ({
                id: tagline.dashapp_taglines.id.toString(),
                name: tagline.dashapp_taglines.name,
            }),
        );
        brandDTO.association = brandDetails.dashapp_brand_association.map(
            (association) => ({
                associationLevelId: {
                    id: association.dashapp_team_association?.association_level?.id.toString(),
                    name: association.dashapp_team_association
                        ?.association_level?.name,
                },
                costOfAssociation: association.dashapp_team_association?.cost,
                team: {
                    id: association.dashapp_team_association?.dashapp_team?.id.toString(),
                    name: association.dashapp_team_association?.dashapp_team
                        ?.team_name,
                },
            }),
        );
        brandDTO.createdBy = {
            id: brandDetails.created_by?.id.toString(),
            name: brandDetails.created_by?.email,
        };
        brandDTO.modifiedBy = {
            id: brandDetails.modified_by?.id.toString(),
            name: brandDetails.modified_by?.email,
        };
        brandDTO.createdDate = brandDetails.created_date;
        brandDTO.modifiedDate = brandDetails.modified_date;
        brandDTO.endorsements = brandDetails.dashapp_brandendorsements.map(
            (endorse) => ({
                id: endorse.id.toString(),
                name: endorse.name,
                active: endorse.active,
            }),
        );
        brandDTO.activeCampaigns =
            brandDetails.dashapp_companydata_active_campaigns.map(
                (activeCampaign) => ({
                    id: activeCampaign.dashapp_activecampaigns.id.toString(),
                    name: activeCampaign.dashapp_activecampaigns.name,
                }),
            );
        brandDTO.primaryMarketingPlatform =
            brandDetails.dashapp_companydata_marketing_platforms_primary.map(
                (platform) => ({
                    id: platform.dashapp_marketingplatform.id.toString(),
                    name: platform.dashapp_marketingplatform.platform,
                }),
            );
        brandDTO.secondaryMarketingPlatform =
            brandDetails.dashapp_companydata_marketing_platforms_secondary.map(
                (platform) => ({
                    id: platform.dashapp_marketingplatform.id.toString(),
                    name: platform.dashapp_marketingplatform.platform,
                }),
            );
        brandDTO.age = brandDetails.dashapp_companydata_age.map((age) => ({
            id: age.dashapp_age?.id.toString(),
            name: age.dashapp_age?.age_range,
        }));
        brandDTO.gender = brandDetails.dashapp_companydata_gender.map(
            (gender) => ({
                id: gender.dashapp_gender?.id.toString(),
                name: gender.dashapp_gender?.gender_is,
            }),
        );
        brandDTO.nccs = brandDetails.dashapp_companydata_income.map((nccs) => ({
            id: nccs.dashapp_nccs?.id.toString(),
            name: nccs.dashapp_nccs?.nccs_class,
        }));
        brandDTO.primaryKeyMarket =
            brandDetails.dashapp_companydata_key_markets_primary.map(
                (market) => ({
                    id: market.dashapp_keymarket.id.toString(),
                    name: market.dashapp_keymarket.zone,
                }),
            );
        brandDTO.secondaryKeyMarket =
            brandDetails.dashapp_companydata_key_markets_secondary.map(
                (market) => ({
                    id: market.dashapp_keymarket.id.toString(),
                    name: market.dashapp_keymarket.zone,
                }),
            );
        brandDTO.tertiary =
            brandDetails.dashapp_companydata_key_markets_tertiary.map(
                (state) => ({
                    id: state.dashapp_states.id.toString(),
                    name: state.dashapp_states.state,
                }),
            );
        brandDTO.mainPersonalityTraits = brandDetails.mainPersonalities.map(
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
        brandDTO.sportsDealSummary = brandDetails.dashapp_sportsdealsummary.map(
            (deal) => ({
                id: deal.id.toString(),
                annualValue: deal.annual_value?.toString(),
                assets: deal.dashapp_sportsdeal_assets.map((asset) => ({
                    id: asset.dashapp_assets.id.toString(),
                    name: asset.dashapp_assets.asset,
                })),
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
                commencementDate: deal.commencement_date,
                duration: deal.duration,
                expirationDate: deal.expiration_date,
                level: {
                    id: deal.dashapp_level?.id.toString(),
                    name: deal.dashapp_level?.name,
                },
                mediaLink: deal.media_link,
                status: deal.status,
                territory: {
                    id: deal.dashapp_territory?.id.toString(),
                    name: deal.dashapp_territory?.name,
                },
                totalValue: deal.total_value?.toString(),
                type: deal.type,
            }),
        );
        brandDTO.activations = brandDetails.dashapp_activation.map(
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
                name: activation.name,
                type: activation.dashapp_activation_type.map((type) => ({
                    id: type.dashapp_marketingplatform.id.toString(),
                    name: type.dashapp_marketingplatform.platform,
                })),
                year: activation.Year,
            }),
        );
        brandDTO.contactPersons = brandDetails.dashapp_brandcontact.map(
            (contact) => ({
                contactId: contact.id.toString(),
                contactDesignation: contact.contact_designation,
                contactEmail: contact.contact_email,
                contactLinkedin: contact.contact_linkedin,
                contactName: contact.contact_name,
                contactNumber: contact.contact_no,
            }),
        );

        return brandDTO;
    }
}
