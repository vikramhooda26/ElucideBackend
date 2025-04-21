/**
 * Reference: https://stackoverflow.com/questions/68366105/get-full-type-on-prisma-client
 */

import { Prisma } from "@prisma/client";

export const leagueSelect = Prisma.validator<Prisma.dashapp_leagueinfoSelect>()({
  id: true,
  property_name: true,
  dashapp_sport: {
    select: {
      id: true,
      name: true,
    },
  },
  dashapp_leagueinfo_owner: {
    select: {
      dashapp_leagueowner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  created_by: {
    select: {
      id: true,
      email: true,
    },
  },
  modified_by: {
    select: {
      id: true,
      email: true,
    },
  },
  modified_date: true,
  created_date: true,
  year_of_inception: true,
  dashapp_broadcastpartner: {
    select: {
      id: true,
      name: true,
    },
  },
  dashapp_ottpartner: {
    select: {
      id: true,
      name: true,
    },
  },
  format: {
    select: {
      id: true,
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
          id: true,
          name: true,
        },
      },
    },
  },
  dashapp_leagueinfo_active_campaigns: {
    select: {
      dashapp_activecampaigns: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  dashapp_leagueinfo_key_markets_primary: {
    select: {
      dashapp_keymarket: {
        select: {
          id: true,
          zone: true,
        },
      },
    },
  },
  dashapp_leagueinfo_key_markets_secondary: {
    select: {
      dashapp_keymarket: {
        select: {
          id: true,
          zone: true,
        },
      },
    },
  },
  dashapp_leagueinfo_key_markets_tertiary: {
    select: {
      dashapp_states: {
        select: {
          id: true,
          state: true,
        },
      },
    },
  },
  dashapp_leagueinfo_marketing_platforms_primary: {
    select: {
      dashapp_marketingplatform: {
        select: {
          id: true,
          platform: true,
        },
      },
    },
  },
  dashapp_leagueinfo_marketing_platforms_secondary: {
    select: {
      dashapp_marketingplatform: {
        select: {
          id: true,
          platform: true,
        },
      },
    },
  },
  dashapp_leagueinfo_association: {
    select: {
      id: true,
      cost: true,
      association_level: {
        select: { id: true, name: true },
      },
    },
  },
  dashapp_leagueinfo_tier: {
    select: {
      dashapp_tier: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  dashapp_leagueendorsements: {
    select: {
      id: true,
      name: true,
      active: true,
    },
  },
  dashapp_leagueinfo_age: {
    select: {
      dashapp_age: {
        select: {
          id: true,
          age_range: true,
        },
      },
    },
  },
  dashapp_leagueinfo_income: {
    select: {
      dashapp_nccs: {
        select: {
          id: true,
          nccs_class: true,
        },
      },
    },
  },
  dashapp_sportsdealsummary: {
    select: {
      id: true,
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
      dashapp_leagueinfo: {
        select: {
          id: true,
          property_name: true,
        },
      },
      dashapp_athlete: { select: { id: true, athlete_name: true } },
      dashapp_team: { select: { id: true, team_name: true } },
      dashapp_companydata: {
        select: {
          id: true,
          company_name: true,
        },
      },
      commencement_date: true,
      status: true,
      type: true,
      dashapp_level: {
        select: {
          id: true,
          name: true,
        },
      },
      expiration_date: true,
      duration: true,
      annual_value: true,
      total_value: true,
      dashapp_territory: { select: { id: true, name: true } },
      media_link: true,
    },
  },
  dashapp_activation: {
    select: {
      id: true,
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
            select: {
              id: true,
              asset: true,
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
      dashapp_leagueinfo: {
        select: {
          id: true,
          property_name: true,
        },
      },
      dashapp_athlete: { select: { id: true, athlete_name: true } },
      dashapp_team: { select: { id: true, team_name: true } },
      Year: true,
    },
  },
  dashapp_leaguecontact: {
    select: {
      id: true,
      contact_name: true,
      contact_designation: true,
      contact_email: true,
      contact_no: true,
      contact_linkedin: true,
    },
  },
  dashapp_broadcast_partner_metrics: {
    select: {
      id: true,
      dashapp_broadcastpartner: { select: { id: true, name: true } },
      viewership: true,
      reach: true,
      year: true,
    },
    orderBy: { year: "desc" },
  },
  dashapp_ott_partner_metrics: {
    select: {
      id: true,
      dashapp_ottpartner: { select: { id: true, name: true } },
      viewership: true,
      reach: true,
      year: true,
    },
    orderBy: { year: "desc" },
  },
  dashapp_leagueinfo_gender: {
    select: {
      dashapp_gender: {
        select: {
          id: true,
          gender_is: true,
        },
      },
    },
  },
  dashapp_team: {
    select: {
      id: true,
      team_name: true,
    },
  },
});

export interface TLeagueDetails
  extends Prisma.dashapp_leagueinfoGetPayload<{
    select: typeof leagueSelect;
  }> {
  mainPersonalities: {
    id: bigint;
    name: string;
    dashapp_subpersonality: {
      id: bigint;
      name: string;
    }[];
  }[];
}
