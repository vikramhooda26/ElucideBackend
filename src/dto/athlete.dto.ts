import { Prisma } from "@prisma/client";
import { TAthleteDetails } from "../types/athlete.type.js";

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
  strategyOverview?: string | null;
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
  tiers?: {
    id?: string;
    name?: string;
  }[];
  age?: {
    id?: string;
    name?: string;
  }[];
  athleteAge?: string | null;
  mainPersonalityTraits?: {
    id?: string;
    name?: string;
    subPersonalityTraits?: {
      id?: string;
      name?: string;
    }[];
  }[];
  association?: {
    associationId?: string;
    associationLevel?: {
      id?: string;
      name?: string | null;
    };
    costOfAssociation?: Prisma.Decimal | null;
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
  sportsDealSummary?: {
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
  gender?: {
    id?: string;
    name?: string;
  }[];
  athleteGender?: {
    id?: string;
    name?: string;
  };
  nccs?: {
    id?: string;
    name?: string;
  }[];
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
    athleteDTO.strategyOverview = athleteDetails.strategy_overview;
    athleteDTO.primaryKeyMarket = athleteDetails.dashapp_athlete_key_markets_primary.map((market) => ({
      id: market.dashapp_keymarket.id.toString(),
      name: market.dashapp_keymarket.zone,
    }));
    athleteDTO.secondaryKeyMarket = athleteDetails.dashapp_athlete_key_markets_secondary.map((market) => ({
      id: market.dashapp_keymarket.id.toString(),
      name: market.dashapp_keymarket.zone,
    }));
    athleteDTO.tertiary = athleteDetails.dashapp_athlete_key_markets_tertiary.map((state) => ({
      id: state.dashapp_states.id.toString(),
      name: state.dashapp_states.state,
    }));
    athleteDTO.tiers = athleteDetails.dashapp_athlete_tier.map((tier) => ({
      id: tier.dashapp_tier?.id.toString(),
      name: tier.dashapp_tier?.name,
    }));
    athleteDTO.createdBy = {
      id: athleteDetails.created_by?.id.toString(),
      name: athleteDetails.created_by?.email,
    };
    athleteDTO.modifiedBy = {
      id: athleteDetails.modified_by?.id.toString(),
      name: athleteDetails.modified_by?.email,
    };
    athleteDTO.createdDate = athleteDetails.created_date;
    athleteDTO.modifiedDate = athleteDetails.modified_date;
    athleteDTO.age = athleteDetails.dashapp_athlete_target_age.map((age) => ({
      id: age.dashapp_age?.id.toString(),
      name: age.dashapp_age?.age_range,
    }));
    athleteDTO.mainPersonalityTraits = athleteDetails.mainPersonalities.map((trait) => ({
      id: trait.id.toString(),
      name: trait.name,
      subPersonalityTraits: trait.dashapp_subpersonality.map((sub) => ({
        id: sub.id.toString(),
        name: sub.name,
      })),
    }));
    athleteDTO.athleteAge = athleteDetails?.age;
    athleteDTO.association = athleteDetails.dashapp_athlete_association.map((association) => ({
      associationId: association.id.toString(),
      associationLevel: {
        id: association.association_level?.id.toString(),
        name: association.association_level?.name,
      },
      costOfAssociation: association.cost,
    }));
    athleteDTO.activations = athleteDetails.dashapp_activation.map((activation) => ({
      id: activation.id.toString(),
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
      brand: {
        id: activation.dashapp_companydata?.id.toString(),
        name: activation.dashapp_companydata?.company_name,
      },
      athlete: {
        id: activation.dashapp_athlete?.id.toString(),
        name: activation.dashapp_athlete?.athlete_name,
      },
      team: {
        id: activation.dashapp_team?.id.toString(),
        name: activation.dashapp_team?.team_name,
      },
      league: {
        id: activation.dashapp_leagueinfo?.id.toString(),
        name: activation.dashapp_leagueinfo?.property_name,
      },
    }));
    athleteDTO.sportsDealSummary = athleteDetails.dashapp_sportsdealsummary.map((deal) => ({
      id: deal.id.toString(),
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
      brand: {
        id: deal.dashapp_companydata?.id.toString(),
        name: deal.dashapp_companydata?.company_name,
      },
      athlete: {
        id: deal.dashapp_athlete?.id.toString(),
        name: deal.dashapp_athlete?.athlete_name,
      },
      team: {
        id: deal.dashapp_team?.id.toString(),
        name: deal.dashapp_team?.team_name,
      },
      league: {
        id: deal.dashapp_leagueinfo?.id.toString(),
        name: deal.dashapp_leagueinfo?.property_name,
      },
    }));
    athleteDTO.contactPersons = athleteDetails.dashapp_athletecontact.map((contact) => ({
      contactId: contact.id.toString(),
      contactName: contact.contact_name,
      contactEmail: contact.contact_email,
      contactLinkedin: contact.contact_linkedin,
      contactNumber: contact.contact_no,
      contactDesignation: contact.contact_designation,
    }));
    athleteDTO.gender = athleteDetails.dashapp_athlete_target_gender.map((gender) => ({
      id: gender.dashapp_gender?.id.toString(),
      name: gender.dashapp_gender?.gender_is,
    }));
    athleteDTO.athleteGender = {
      id: athleteDetails.dashapp_gender?.id.toString(),
      name: athleteDetails.dashapp_gender?.gender_is,
    };
    athleteDTO.nccs = athleteDetails.dashapp_athlete_target_income.map((nccs) => ({
      id: nccs.dashapp_nccs?.id.toString(),
      name: nccs.dashapp_nccs?.nccs_class,
    }));
    (athleteDTO.primaryMarketingPlatform = athleteDetails.dashapp_athlete_socialmedia_platform_primary.map(
      (social) => ({
        id: social.dashapp_socialmedia_platform?.id.toString(),
        name: social.dashapp_socialmedia_platform?.name,
      }),
    )),
      (athleteDTO.secondaryMarketingPlatform = athleteDetails.dashapp_athlete_socialmedia_platform_secondary.map(
        (social) => ({
          id: social.dashapp_socialmedia_platform?.id.toString(),
          name: social.dashapp_socialmedia_platform?.name,
        }),
      ));
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
