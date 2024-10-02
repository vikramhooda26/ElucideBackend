import { Prisma } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { STATUS_CODE } from "../lib/constants.js";
import { TFilteredStakeholdersSchema } from "../schemas/stakeholders.schema.js";
import { getAthletes } from "./athlete.controller.js";
import { getBrands } from "./brand.controller.js";
import { getGenderQuery } from "./constants/index.js";
import { getAthletesCount, getBrandsCount, getLeaguesCount, getTeamsCount } from "./dashboard/helpers.js";
import { getLeagues } from "./league.controller.js";
import { getTeams } from "./team.controller.js";

const getFilteredAthletes = async (
    filterData: TFilteredStakeholdersSchema,
    { take, skip }: { take: any; skip: any },
) => {
    const {
        ageIds,
        contactDesignation,
        contactEmail,
        contactLinkedin,
        contactName,
        contactNumber,
        facebook,
        genderIds,
        instagram,
        linkedin,
        nccsIds,
        primaryMarketIds,
        secondaryMarketIds,
        strategyOverview,
        subPersonalityTraitIds,
        tertiaryIds,
        tierIds,
        twitter,
        website,
        youtube,
        isMandatory,
    } = filterData;

    const AthleteFilterConditions: Prisma.dashapp_athleteWhereInput = {
        dashapp_athlete_target_age: ageIds?.length
            ? {
                  some: {
                      dashapp_age: {
                          id: { in: ageIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_athlete_target_income: nccsIds?.length
            ? {
                  some: {
                      dashapp_nccs: {
                          id: { in: nccsIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_athlete_key_markets_primary: primaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: { in: primaryMarketIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_athlete_key_markets_secondary: secondaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: {
                              in: secondaryMarketIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_athlete_key_markets_tertiary: tertiaryIds?.length
            ? {
                  some: {
                      dashapp_states: {
                          id: { in: tertiaryIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_athlete_personality_traits: subPersonalityTraitIds?.length
            ? {
                  some: {
                      dashapp_subpersonality: {
                          id: {
                              in: subPersonalityTraitIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        strategy_overview: strategyOverview
            ? {
                  contains: strategyOverview,
                  mode: "insensitive",
              }
            : undefined,

        dashapp_athlete_target_gender: genderIds?.length
            ? {
                  every: {
                      dashapp_gender: await getGenderQuery(genderIds),
                  },
              }
            : undefined,

        dashapp_athlete_tier: tierIds?.length
            ? {
                  some: {
                      dashapp_tier: {
                          id: { in: tierIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        facebook: facebook ? { contains: facebook, mode: "insensitive" } : undefined,
        instagram: instagram ? { contains: instagram, mode: "insensitive" } : undefined,
        twitter: twitter ? { contains: twitter, mode: "insensitive" } : undefined,
        linkedin: linkedin ? { contains: linkedin, mode: "insensitive" } : undefined,
        youtube: youtube ? { contains: youtube, mode: "insensitive" } : undefined,
        website: website ? { contains: website, mode: "insensitive" } : undefined,

        dashapp_athletecontact: {
            some: {
                contact_name: {
                    contains: contactName,
                    mode: "insensitive",
                },
                contact_designation: {
                    contains: contactDesignation,
                    mode: "insensitive",
                },
                contact_email: {
                    contains: contactEmail,
                    mode: "insensitive",
                },
                contact_no: {
                    contains: contactNumber,
                },
                contact_linkedin: {
                    contains: contactLinkedin,
                    mode: "insensitive",
                },
            },
        },
    };

    const combinedFilterConditions = isMandatory
        ? AthleteFilterConditions
        : {
              OR: Object.entries(AthleteFilterConditions)
                  .filter(([_, condition]) => condition)
                  .map(([key, condition]) => ({ [key]: condition })),
          };

    const [athletes, count] = await Promise.all([
        getAthletes({ query: combinedFilterConditions, take, skip }),
        getAthletesCount(),
    ]);

    if (athletes.length < 1) {
        return [];
    }

    const modifiedAthletes =
        genderIds?.length === 2
            ? athletes.filter((athlete) => athlete.dashapp_athlete_target_gender.length === 2)
            : athletes;

    return modifiedAthletes.map((athlete) => ({
        id: athlete.id,
        name: athlete.athlete_name,
        createdDate: athlete.created_date,
        modifiedDate: athlete.modified_date,
        createdBy: {
            userId: athlete.created_by?.id,
            email: athlete.created_by?.email,
        },
        modifiedBy: {
            userId: athlete.modified_by?.id,
            email: athlete.modified_by?.email,
        },
        count,
    }));
};

const getFilteredLeagues = async (
    filterData: TFilteredStakeholdersSchema,
    { take, skip }: { take: any; skip: any },
) => {
    const {
        ageIds,
        genderIds,
        nccsIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        subPersonalityTraitIds,
        tierIds,
        strategyOverview,
        instagram,
        facebook,
        linkedin,
        twitter,
        website,
        youtube,
        contactDesignation,
        contactEmail,
        contactLinkedin,
        contactName,
        contactNumber,
        isMandatory,
    } = filterData;

    const LeagueFilterConditions: Prisma.dashapp_leagueinfoWhereInput = {
        dashapp_leagueinfo_age: ageIds?.length
            ? {
                  some: {
                      dashapp_age: {
                          id: { in: ageIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_gender: genderIds?.length
            ? {
                  every: {
                      dashapp_gender: await getGenderQuery(genderIds),
                  },
              }
            : undefined,

        dashapp_leagueinfo_income: nccsIds?.length
            ? {
                  some: {
                      dashapp_nccs: {
                          id: { in: nccsIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_key_markets_primary: primaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: { in: primaryMarketIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_key_markets_secondary: secondaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: {
                              in: secondaryMarketIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_key_markets_tertiary: tertiaryIds?.length
            ? {
                  some: {
                      dashapp_states: {
                          id: { in: tertiaryIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_personality_traits: subPersonalityTraitIds?.length
            ? {
                  some: {
                      dashapp_subpersonality: {
                          id: {
                              in: subPersonalityTraitIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_leagueinfo_tier: tierIds?.length
            ? {
                  some: {
                      dashapp_tier: {
                          id: { in: tierIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        strategy_overview: strategyOverview
            ? {
                  contains: strategyOverview,
                  mode: "insensitive",
              }
            : undefined,

        facebook: facebook ? { contains: facebook, mode: "insensitive" } : undefined,
        instagram: instagram ? { contains: instagram, mode: "insensitive" } : undefined,
        twitter: twitter ? { contains: twitter, mode: "insensitive" } : undefined,
        linkedin: linkedin ? { contains: linkedin, mode: "insensitive" } : undefined,
        youtube: youtube ? { contains: youtube, mode: "insensitive" } : undefined,
        website: website ? { contains: website, mode: "insensitive" } : undefined,

        dashapp_leaguecontact: {
            some: {
                contact_name: {
                    contains: contactName,
                    mode: "insensitive",
                },
                contact_designation: {
                    contains: contactDesignation,
                    mode: "insensitive",
                },
                contact_email: {
                    contains: contactEmail,
                    mode: "insensitive",
                },
                contact_no: {
                    contains: contactNumber,
                },
                contact_linkedin: {
                    contains: contactLinkedin,
                    mode: "insensitive",
                },
            },
        },
    };

    const combinedFilterConditions = isMandatory
        ? LeagueFilterConditions
        : {
              OR: Object.entries(LeagueFilterConditions)
                  .filter(([_, condition]) => condition)
                  .map(([key, condition]) => ({ [key]: condition })),
          };

    const [leagues, count] = await Promise.all([
        getLeagues({ query: combinedFilterConditions, take, skip }),
        getLeaguesCount(),
    ]);

    if (leagues.length < 1) {
        return [];
    }

    const modifiedLeagues =
        genderIds?.length === 2 ? leagues.filter((league) => league.dashapp_leagueinfo_gender.length === 2) : leagues;

    return modifiedLeagues.map((league) => ({
        id: league.id,
        name: league.property_name,
        createdDate: league.created_date,
        modifiedDate: league.modified_date,
        createdBy: {
            userId: league.created_by?.id,
            email: league.created_by?.email,
        },
        modifiedBy: {
            userId: league.modified_by?.id,
            email: league.modified_by?.email,
        },
        count,
    }));
};

const getFilteredTeams = async (filterData: TFilteredStakeholdersSchema, { take, skip }: { take: any; skip: any }) => {
    const {
        ageIds,
        genderIds,
        nccsIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        subPersonalityTraitIds,
        tierIds,
        strategyOverview,
        instagram,
        facebook,
        linkedin,
        twitter,
        website,
        youtube,
        contactDesignation,
        contactEmail,
        contactLinkedin,
        contactName,
        contactNumber,
        isMandatory,
    } = filterData;

    const teamFilterConditions: Prisma.dashapp_teamWhereInput = {
        dashapp_team_age: ageIds?.length
            ? {
                  some: {
                      dashapp_age: {
                          id: { in: ageIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_gender: genderIds?.length
            ? {
                  every: {
                      dashapp_gender: await getGenderQuery(genderIds),
                  },
              }
            : undefined,

        dashapp_team_income: nccsIds?.length
            ? {
                  some: {
                      dashapp_nccs: {
                          id: { in: nccsIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_key_markets_primary: primaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: { in: primaryMarketIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_key_markets_secondary: secondaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: {
                              in: secondaryMarketIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_team_key_markets_tertiary: tertiaryIds?.length
            ? {
                  some: {
                      dashapp_states: {
                          id: { in: tertiaryIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_tier: tierIds?.length
            ? {
                  some: {
                      dashapp_tier: {
                          id: { in: tierIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_team_personality_traits: subPersonalityTraitIds?.length
            ? {
                  some: {
                      dashapp_subpersonality: {
                          id: {
                              in: subPersonalityTraitIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        facebook: facebook ? { contains: facebook, mode: "insensitive" } : undefined,
        instagram: instagram ? { contains: instagram, mode: "insensitive" } : undefined,
        twitter: twitter ? { contains: twitter, mode: "insensitive" } : undefined,
        linkedin: linkedin ? { contains: linkedin, mode: "insensitive" } : undefined,
        youtube: youtube ? { contains: youtube, mode: "insensitive" } : undefined,
        website: website ? { contains: website, mode: "insensitive" } : undefined,

        strategy_overview: strategyOverview
            ? {
                  contains: strategyOverview,
                  mode: "insensitive",
              }
            : undefined,

        dashapp_teamcontact: {
            some: {
                contact_name: {
                    contains: contactName,
                    mode: "insensitive",
                },
                contact_designation: {
                    contains: contactDesignation,
                    mode: "insensitive",
                },
                contact_email: {
                    contains: contactEmail,
                    mode: "insensitive",
                },
                contact_no: {
                    contains: contactNumber,
                },
                contact_linkedin: {
                    contains: contactLinkedin,
                    mode: "insensitive",
                },
            },
        },
    };

    const combinedFilterConditions = isMandatory
        ? teamFilterConditions
        : {
              OR: Object.entries(teamFilterConditions)
                  .filter(([_, condition]) => condition)
                  .map(([key, condition]) => ({ [key]: condition })),
          };

    const [teams, count] = await Promise.all([
        getTeams({ query: combinedFilterConditions, take, skip }),
        getTeamsCount(),
    ]);

    if (teams.length < 1) {
        return [];
    }

    const modifiedTeams =
        genderIds?.length === 2 ? teams.filter((team) => team.dashapp_team_gender.length === 2) : teams;

    return modifiedTeams.map((team) => ({
        id: team.id,
        name: team.team_name,
        createdDate: team.created_date,
        modifiedDate: team.modified_date,
        createdBy: {
            userId: team.created_by?.id,
            email: team.created_by?.email,
        },
        modifiedBy: {
            userId: team.modified_by?.id,
            email: team.modified_by?.email,
        },
        count,
    }));
};

const getFilteredBrands = async (filterData: TFilteredStakeholdersSchema, { take, skip }: { take: any; skip: any }) => {
    const {
        ageIds,
        genderIds,
        nccsIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
        subPersonalityTraitIds,
        tierIds,
        strategyOverview,
        instagram,
        facebook,
        linkedin,
        twitter,
        website,
        youtube,
        contactDesignation,
        contactEmail,
        contactLinkedin,
        contactName,
        contactNumber,
        isMandatory,
    } = filterData;

    const brandFilterConditions: Prisma.dashapp_companydataWhereInput = {
        dashapp_companydata_age: ageIds?.length
            ? {
                  some: {
                      dashapp_age: {
                          id: { in: ageIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_gender: genderIds?.length
            ? {
                  every: {
                      dashapp_gender: await getGenderQuery(genderIds),
                  },
              }
            : undefined,

        dashapp_companydata_income: nccsIds?.length
            ? {
                  some: {
                      dashapp_nccs: {
                          id: { in: nccsIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_key_markets_primary: primaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: { in: primaryMarketIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_key_markets_secondary: secondaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: {
                              in: secondaryMarketIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_key_markets_tertiary: tertiaryIds?.length
            ? {
                  some: {
                      dashapp_states: {
                          id: { in: tertiaryIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_tier: tierIds?.length
            ? {
                  some: {
                      dashapp_tier: {
                          id: { in: tierIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_personality_traits: subPersonalityTraitIds?.length
            ? {
                  some: {
                      dashapp_subpersonality: {
                          id: {
                              in: subPersonalityTraitIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        strategy_overview: strategyOverview
            ? {
                  contains: strategyOverview,
                  mode: "insensitive",
              }
            : undefined,

        facebook: facebook ? { contains: facebook, mode: "insensitive" } : undefined,
        instagram: instagram ? { contains: instagram, mode: "insensitive" } : undefined,
        twitter: twitter ? { contains: twitter, mode: "insensitive" } : undefined,
        linkedin: linkedin ? { contains: linkedin, mode: "insensitive" } : undefined,
        youtube: youtube ? { contains: youtube, mode: "insensitive" } : undefined,
        website: website ? { contains: website, mode: "insensitive" } : undefined,

        dashapp_brandcontact: {
            some: {
                contact_name: {
                    contains: contactName,
                    mode: "insensitive",
                },
                contact_designation: {
                    contains: contactDesignation,
                    mode: "insensitive",
                },
                contact_email: {
                    contains: contactEmail,
                    mode: "insensitive",
                },
                contact_no: {
                    contains: contactNumber,
                },
                contact_linkedin: {
                    contains: contactLinkedin,
                    mode: "insensitive",
                },
            },
        },
    };

    const combinedFilterConditions = isMandatory
        ? brandFilterConditions
        : {
              OR: Object.entries(brandFilterConditions)
                  .filter(([_, condition]) => condition)
                  .map(([key, condition]) => ({ [key]: condition })),
          };

    const [brands, count] = await Promise.all([
        getBrands({ query: combinedFilterConditions, take, skip }),
        getBrandsCount(),
    ]);

    if (brands.length < 1) {
        return [];
    }

    const modifiedBrands =
        genderIds?.length === 2 ? brands.filter((brand) => brand.dashapp_companydata_gender.length === 2) : brands;

    return modifiedBrands.map((brand) => ({
        id: brand.id,
        name: brand.company_name,
        createdDate: brand.created_date,
        modifiedDate: brand.modified_date,
        createdBy: {
            userId: brand.created_by?.id,
            email: brand.created_by?.email,
        },
        modifiedBy: {
            userId: brand.modified_by?.id,
            email: brand.modified_by?.email,
        },
        count,
    }));
};

export const getFilteredStakeholders = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const [filteredAthletes, filteredLeagues, filteredTeams, filteredBrands] = await Promise.all([
        getFilteredAthletes(req.validatedData, { take, skip }),
        getFilteredLeagues(req.validatedData, { take, skip }),
        getFilteredTeams(req.validatedData, { take, skip }),
        getFilteredBrands(req.validatedData, { take, skip }),
    ]);

    res.status(STATUS_CODE.OK).json({
        filteredAthletes,
        filteredLeagues,
        filteredTeams,
        filteredBrands,
    });
});
