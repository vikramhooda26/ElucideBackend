import { Prisma } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { AthleteResponseDTO } from "../dto/athlete.dto.js";
import { LeagueResponseDTO } from "../dto/league.dto.js";
import { TeamResponseDTO } from "../dto/team.dto.js";
import { STATUS_CODE } from "../lib/constants.js";
import { TFilteredStakeholdersSchema } from "../schemas/stakeholders.schema.js";
import { athleteSelect, TAthleteDetails } from "../types/athlete.type.js";
import { leagueSelect, TLeagueDetails } from "../types/league.type.js";
import { teamSelect, TTeamDetails } from "../types/team.type.js";
import { getAthletes } from "./athlete.controller.js";
import { getCostQuery, getGenderQuery } from "./constants/index.js";
import { getLeagues } from "./league.controller.js";
import { getTeams } from "./team.controller.js";

const getFilteredAthletes = async (
    filterData: TFilteredStakeholdersSchema,
    { take, skip }: { take: any; skip: any },
) => {
    const {
        costOfAssociation,
        associationLevelIds,
        sportIds,
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

        dashapp_athlete_association:
            associationLevelIds?.length || costOfAssociation?.cost?.length
                ? {
                      some: {
                          association_level_id: associationLevelIds?.length
                              ? {
                                    in: associationLevelIds.map((id) => BigInt(id)),
                                }
                              : undefined,
                          cost: costOfAssociation?.cost?.length ? getCostQuery(costOfAssociation) : undefined,
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

        dashapp_sport: sportIds?.length
            ? {
                  id: { in: sportIds.map((id) => BigInt(id)) },
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

        dashapp_athletecontact:
            contactName || contactDesignation || contactEmail || contactNumber || contactLinkedin
                ? {
                      some: {
                          contact_name: contactName
                              ? {
                                    contains: contactName,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_designation: contactDesignation
                              ? {
                                    contains: contactDesignation,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_email: contactEmail
                              ? {
                                    contains: contactEmail,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_no: contactNumber
                              ? {
                                    contains: contactNumber,
                                }
                              : undefined,
                          contact_linkedin: contactLinkedin
                              ? {
                                    contains: contactLinkedin,
                                    mode: "insensitive",
                                }
                              : undefined,
                      },
                  }
                : undefined,
    };

    const combinedFilterConditions = isMandatory
        ? AthleteFilterConditions
        : {
              OR: Object.entries(AthleteFilterConditions)
                  .filter(([_, condition]) => condition)
                  .map(([key, condition]) => ({ [key]: condition })),
          };

    const athletes = await getAthletes({ query: combinedFilterConditions, take, skip, select: athleteSelect });

    if (athletes.length < 1) {
        return [];
    }

    const modifiedAthletes =
        genderIds?.length === 2
            ? athletes.filter((athlete) => athlete.dashapp_athlete_target_gender.length === 2)
            : athletes;

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_athlete_personality_traits: {
                        some: { athlete_id: { in: modifiedAthletes.map((athlete) => athlete.id) } },
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            dashapp_subpersonality: {
                where: {
                    dashapp_athlete_personality_traits: {
                        some: { athlete_id: { in: modifiedAthletes.map((athlete) => athlete.id) } },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    dashapp_athlete_personality_traits: {
                        select: {
                            athlete_id: true,
                        },
                    },
                },
            },
        },
    });

    const personalitiesByAthleteId: Record<string, typeof mainPersonalities> = {};

    mainPersonalities.forEach((personality) => {
        const athleteIds = personality.dashapp_subpersonality.flatMap((sub) =>
            sub.dashapp_athlete_personality_traits.map((trait) => trait?.athlete_id).filter(Boolean),
        );
        athleteIds.forEach((athleteId) => {
            const athleteIdStr = athleteId.toString();
            if (!personalitiesByAthleteId[athleteIdStr]) {
                personalitiesByAthleteId[athleteIdStr] = [];
            }

            const alreadyAdded = personalitiesByAthleteId[athleteIdStr].some((p) => p.id === personality.id);

            if (!alreadyAdded) {
                personalitiesByAthleteId[athleteIdStr].push(personality);
            }
        });
    });

    const updatedAthletes = modifiedAthletes.map((athlete) => ({
        ...athlete,
        mainPersonalities: personalitiesByAthleteId[athlete.id.toString()] || [],
    }));

    const athleteResponse: AthleteResponseDTO[] = updatedAthletes.map((athlete) =>
        AthleteResponseDTO.toResponse(athlete as unknown as TAthleteDetails),
    );

    return athleteResponse;
};

const getFilteredLeagues = async (
    filterData: TFilteredStakeholdersSchema,
    { take, skip }: { take: any; skip: any },
) => {
    const {
        associationLevelIds,
        costOfAssociation,
        sportIds,
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

        dashapp_leagueinfo_association:
            associationLevelIds?.length || costOfAssociation?.cost?.length
                ? {
                      some: {
                          association_level_id: associationLevelIds?.length
                              ? {
                                    in: associationLevelIds.map((id) => BigInt(id)),
                                }
                              : undefined,
                          cost: costOfAssociation?.cost?.length ? getCostQuery(costOfAssociation) : undefined,
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

        dashapp_sport: sportIds?.length
            ? {
                  id: { in: sportIds.map((id) => BigInt(id)) },
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

        dashapp_leaguecontact:
            contactName || contactDesignation || contactEmail || contactNumber || contactLinkedin
                ? {
                      some: {
                          contact_name: contactName
                              ? {
                                    contains: contactName,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_designation: contactDesignation
                              ? {
                                    contains: contactDesignation,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_email: contactEmail
                              ? {
                                    contains: contactEmail,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_no: contactNumber
                              ? {
                                    contains: contactNumber,
                                }
                              : undefined,
                          contact_linkedin: contactLinkedin
                              ? {
                                    contains: contactLinkedin,
                                    mode: "insensitive",
                                }
                              : undefined,
                      },
                  }
                : undefined,
    };

    const combinedFilterConditions = isMandatory
        ? LeagueFilterConditions
        : {
              OR: Object.entries(LeagueFilterConditions)
                  .filter(([_, condition]) => condition)
                  .map(([key, condition]) => ({ [key]: condition })),
          };

    const leagues = await getLeagues({ query: combinedFilterConditions, take, skip, select: leagueSelect });

    if (leagues.length < 1) {
        return [];
    }

    const modifiedLeagues =
        genderIds?.length === 2 ? leagues.filter((league) => league.dashapp_leagueinfo_gender.length === 2) : leagues;

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_leagueinfo_personality_traits: {
                        some: { leagueinfo_id: { in: modifiedLeagues.map((league) => league.id) } },
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            dashapp_subpersonality: {
                where: {
                    dashapp_leagueinfo_personality_traits: {
                        some: {
                            leagueinfo_id: { in: modifiedLeagues.map((league) => league.id) },
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    dashapp_leagueinfo_personality_traits: {
                        select: {
                            leagueinfo_id: true,
                        },
                    },
                },
            },
        },
    });

    const personalitiesByleagueId: Record<string, typeof mainPersonalities> = {};

    mainPersonalities.forEach((personality) => {
        const leagueIds = personality.dashapp_subpersonality.flatMap((sub) =>
            sub.dashapp_leagueinfo_personality_traits.map((trait) => trait.leagueinfo_id),
        );
        leagueIds.forEach((leagueId) => {
            const leagueIdStr = leagueId.toString();
            if (!personalitiesByleagueId[leagueIdStr]) {
                personalitiesByleagueId[leagueIdStr] = [];
            }

            const alreadyAdded = personalitiesByleagueId[leagueIdStr].some((p) => p.id === personality.id);

            if (!alreadyAdded) {
                personalitiesByleagueId[leagueIdStr].push(personality);
            }
        });
    });

    const updatedLeagues = modifiedLeagues.map((league) => ({
        ...league,
        mainPersonalities: personalitiesByleagueId[league.id.toString()] || [],
    }));

    const leagueResponse: LeagueResponseDTO[] = updatedLeagues.map((league) =>
        LeagueResponseDTO.toResponse(league as unknown as TLeagueDetails),
    );

    return leagueResponse;
};

const getFilteredTeams = async (filterData: TFilteredStakeholdersSchema, { take, skip }: { take: any; skip: any }) => {
    const {
        associationLevelIds,
        costOfAssociation,
        sportIds,
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

        dashapp_team_association:
            associationLevelIds?.length || costOfAssociation?.cost?.length
                ? {
                      some: {
                          association_level_id: associationLevelIds?.length
                              ? {
                                    in: associationLevelIds.map((id) => BigInt(id)),
                                }
                              : undefined,
                          cost: costOfAssociation?.cost?.length ? getCostQuery(costOfAssociation) : undefined,
                      },
                  }
                : undefined,

        dashapp_sport: sportIds?.length
            ? {
                  id: { in: sportIds.map((id) => BigInt(id)) },
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

        dashapp_teamcontact:
            contactName || contactDesignation || contactEmail || contactNumber || contactLinkedin
                ? {
                      some: {
                          contact_name: contactName
                              ? {
                                    contains: contactName,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_designation: contactDesignation
                              ? {
                                    contains: contactDesignation,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_email: contactEmail
                              ? {
                                    contains: contactEmail,
                                    mode: "insensitive",
                                }
                              : undefined,
                          contact_no: contactNumber
                              ? {
                                    contains: contactNumber,
                                }
                              : undefined,
                          contact_linkedin: contactLinkedin
                              ? {
                                    contains: contactLinkedin,
                                    mode: "insensitive",
                                }
                              : undefined,
                      },
                  }
                : undefined,
    };

    const combinedFilterConditions = isMandatory
        ? teamFilterConditions
        : {
              OR: Object.entries(teamFilterConditions)
                  .filter(([_, condition]) => condition)
                  .map(([key, condition]) => ({ [key]: condition })),
          };

    const teams = await getTeams({ query: combinedFilterConditions, take, skip, select: teamSelect });

    if (teams.length < 1) {
        return [];
    }

    const modifiedTeams =
        genderIds?.length === 2 ? teams.filter((team) => team.dashapp_team_gender.length === 2) : teams;

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_team_personality_traits: {
                        some: { team_id: { in: modifiedTeams.map((team) => team.id) } },
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            dashapp_subpersonality: {
                where: {
                    dashapp_team_personality_traits: {
                        some: {
                            team_id: { in: modifiedTeams.map((team) => team.id) },
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    dashapp_team_personality_traits: {
                        select: {
                            team_id: true,
                        },
                    },
                },
            },
        },
    });

    const personalitiesByTeamId: Record<string, typeof mainPersonalities> = {};

    mainPersonalities.forEach((personality) => {
        const teamIds = personality.dashapp_subpersonality.flatMap((sub) =>
            sub.dashapp_team_personality_traits.map((trait) => trait.team_id),
        );
        teamIds.forEach((teamId) => {
            const teamIdStr = teamId.toString();
            if (!personalitiesByTeamId[teamIdStr]) {
                personalitiesByTeamId[teamIdStr] = [];
            }

            const alreadyAdded = personalitiesByTeamId[teamIdStr].some((p) => p.id === personality.id);

            if (!alreadyAdded) {
                personalitiesByTeamId[teamIdStr].push(personality);
            }
        });
    });

    const updatedTeams = modifiedTeams.map((team) => ({
        ...team,
        mainPersonalities: personalitiesByTeamId[team.id.toString()] || [],
    }));

    const teamResponse: TeamResponseDTO[] = updatedTeams.map((team) =>
        TeamResponseDTO.toResponse(team as unknown as TTeamDetails),
    );

    return teamResponse;
};

// const getFilteredBrands = async (filterData: TFilteredStakeholdersSchema, { take, skip }: { take: any; skip: any }) => {
//     const {
//         ageIds,
//         genderIds,
//         nccsIds,
//         primaryMarketIds,
//         secondaryMarketIds,
//         tertiaryIds,
//         subPersonalityTraitIds,
//         tierIds,
//         strategyOverview,
//         instagram,
//         facebook,
//         linkedin,
//         twitter,
//         website,
//         youtube,
//         contactDesignation,
//         contactEmail,
//         contactLinkedin,
//         contactName,
//         contactNumber,
//         isMandatory,
//     } = filterData;

//     const brandFilterConditions: Prisma.dashapp_companydataWhereInput = {
//         dashapp_companydata_age: ageIds?.length
//             ? {
//                   some: {
//                       dashapp_age: {
//                           id: { in: ageIds.map((id) => BigInt(id)) },
//                       },
//                   },
//               }
//             : undefined,

//         dashapp_companydata_gender: genderIds?.length
//             ? {
//                   every: {
//                       dashapp_gender: await getGenderQuery(genderIds),
//                   },
//               }
//             : undefined,

//         dashapp_companydata_income: nccsIds?.length
//             ? {
//                   some: {
//                       dashapp_nccs: {
//                           id: { in: nccsIds.map((id) => BigInt(id)) },
//                       },
//                   },
//               }
//             : undefined,

//         dashapp_companydata_key_markets_primary: primaryMarketIds?.length
//             ? {
//                   some: {
//                       dashapp_keymarket: {
//                           id: { in: primaryMarketIds.map((id) => BigInt(id)) },
//                       },
//                   },
//               }
//             : undefined,

//         dashapp_companydata_key_markets_secondary: secondaryMarketIds?.length
//             ? {
//                   some: {
//                       dashapp_keymarket: {
//                           id: {
//                               in: secondaryMarketIds.map((id) => BigInt(id)),
//                           },
//                       },
//                   },
//               }
//             : undefined,

//         dashapp_companydata_key_markets_tertiary: tertiaryIds?.length
//             ? {
//                   some: {
//                       dashapp_states: {
//                           id: { in: tertiaryIds.map((id) => BigInt(id)) },
//                       },
//                   },
//               }
//             : undefined,

//         dashapp_companydata_tier: tierIds?.length
//             ? {
//                   some: {
//                       dashapp_tier: {
//                           id: { in: tierIds.map((id) => BigInt(id)) },
//                       },
//                   },
//               }
//             : undefined,

//         dashapp_companydata_personality_traits: subPersonalityTraitIds?.length
//             ? {
//                   some: {
//                       dashapp_subpersonality: {
//                           id: {
//                               in: subPersonalityTraitIds.map((id) => BigInt(id)),
//                           },
//                       },
//                   },
//               }
//             : undefined,

//         strategy_overview: strategyOverview
//             ? {
//                   contains: strategyOverview,
//                   mode: "insensitive",
//               }
//             : undefined,

//         facebook: facebook ? { contains: facebook, mode: "insensitive" } : undefined,
//         instagram: instagram ? { contains: instagram, mode: "insensitive" } : undefined,
//         twitter: twitter ? { contains: twitter, mode: "insensitive" } : undefined,
//         linkedin: linkedin ? { contains: linkedin, mode: "insensitive" } : undefined,
//         youtube: youtube ? { contains: youtube, mode: "insensitive" } : undefined,
//         website: website ? { contains: website, mode: "insensitive" } : undefined,

//         dashapp_brandcontact:
//             contactName || contactDesignation || contactEmail || contactNumber || contactLinkedin
//                 ? {
//                       some: {
//                           contact_name: contactName
//                               ? {
//                                     contains: contactName,
//                                     mode: "insensitive",
//                                 }
//                               : undefined,
//                           contact_designation: contactDesignation
//                               ? {
//                                     contains: contactDesignation,
//                                     mode: "insensitive",
//                                 }
//                               : undefined,
//                           contact_email: contactEmail
//                               ? {
//                                     contains: contactEmail,
//                                     mode: "insensitive",
//                                 }
//                               : undefined,
//                           contact_no: contactNumber
//                               ? {
//                                     contains: contactNumber,
//                                 }
//                               : undefined,
//                           contact_linkedin: contactLinkedin
//                               ? {
//                                     contains: contactLinkedin,
//                                     mode: "insensitive",
//                                 }
//                               : undefined,
//                       },
//                   }
//                 : undefined,
//     };

//     const combinedFilterConditions = isMandatory
//         ? brandFilterConditions
//         : {
//               OR: Object.entries(brandFilterConditions)
//                   .filter(([_, condition]) => condition)
//                   .map(([key, condition]) => ({ [key]: condition })),
//           };

//     const [brands, count] = await Promise.all([
//         getBrands({ query: combinedFilterConditions, take, skip }),
//         getBrandsCount(),
//     ]);

//     if (brands.length < 1) {
//         return [];
//     }

//     const modifiedBrands =
//         genderIds?.length === 2 ? brands.filter((brand) => brand.dashapp_companydata_gender.length === 2) : brands;

//     return modifiedBrands.map((brand) => ({
//         id: brand.id,
//         name: brand.company_name,
//         createdDate: brand.created_date,
//         modifiedDate: brand.modified_date,
//         createdBy: {
//             userId: brand.created_by?.id,
//             email: brand.created_by?.email,
//         },
//         modifiedBy: {
//             userId: brand.modified_by?.id,
//             email: brand.modified_by?.email,
//         },
//         count,
//     }));
// };

export const getFilteredStakeholders = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const [filteredAthletes, filteredLeagues, filteredTeams] = await Promise.all([
        getFilteredAthletes(req.validatedData, { take, skip }),
        getFilteredLeagues(req.validatedData, { take, skip }),
        getFilteredTeams(req.validatedData, { take, skip }),
    ]);

    res.status(STATUS_CODE.OK).json({
        filteredAthletes,
        filteredLeagues,
        filteredTeams,
    });
});
