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
import { exactSetMatch, getCostQuery, getGenderQuery } from "./constants/index.js";
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

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_athlete_personality_traits: {
                        some: { athlete_id: { in: athletes.map((athlete) => athlete.id) } },
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
                        some: { athlete_id: { in: athletes.map((athlete) => athlete.id) } },
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

    const updatedAthletes = athletes.map((athlete) => ({
        ...athlete,
        mainPersonalities: personalitiesByAthleteId[athlete.id.toString()] || [],
    }));

    let filteredAthletes = updatedAthletes;

    // 1. Exact filtering for dashapp_athlete_target_age
    if (ageIds?.length) {
        const requiredAgeIds = ageIds.map((id) => BigInt(id).toString());
        filteredAthletes = filteredAthletes.filter((athlete) => {
            console.log("names:", athlete.athlete_name);
            const athleteAgeIds = athlete.dashapp_athlete_target_age.map((entry: any) => {
                return entry.dashapp_age.id.toString();
            });
            return exactSetMatch(athleteAgeIds, requiredAgeIds);
        });
    }

    // 2. Exact filtering for dashapp_athlete_personality_traits
    if (subPersonalityTraitIds?.length) {
        const requiredTraitIds = subPersonalityTraitIds.map((id) => BigInt(id).toString());
        filteredAthletes = filteredAthletes.filter((athlete) => {
            const athleteTraitIds = athlete.mainPersonalities.flatMap((entry: any) =>
                entry.dashapp_subpersonality.map((sub: any) => sub.id.toString()),
            );
            return exactSetMatch(athleteTraitIds, requiredTraitIds);
        });
    }

    // 3. Exact filtering for dashapp_athlete_tier
    if (tierIds?.length) {
        const requiredGenderIds = tierIds.map((id) => id.toString());
        filteredAthletes = filteredAthletes.filter((athlete) => {
            // Assuming athlete.dashapp_athlete_tier is an array with dashapp_gender objects.
            const athleteGenderIds = athlete.dashapp_athlete_tier.map((entry: any) => entry.dashapp_tier.id.toString());
            return exactSetMatch(athleteGenderIds, requiredGenderIds);
        });
    }

    // 4. Exact filtering for dashapp_athlete_target_income
    if (nccsIds?.length) {
        const requiredNccsIds = nccsIds.map((id) => BigInt(id).toString());
        filteredAthletes = filteredAthletes.filter((athlete) => {
            // Assuming athlete.dashapp_athlete_target_income is an array of objects with dashapp_nccs id.
            const athleteNccsIds = athlete.dashapp_athlete_target_income.map((entry: any) =>
                entry.dashapp_nccs.id.toString(),
            );
            return exactSetMatch(athleteNccsIds, requiredNccsIds);
        });
    }

    // 5. Exact filtering for dashapp_athlete_key_markets_primary
    if (primaryMarketIds?.length) {
        const requiredPrimaryIds = primaryMarketIds.map((id) => BigInt(id).toString());
        filteredAthletes = filteredAthletes.filter((athlete) => {
            // Assuming athlete.dashapp_athlete_key_markets_primary is an array of objects with dashapp_keymarket.
            const athletePrimaryIds = athlete.dashapp_athlete_key_markets_primary.map((entry: any) =>
                entry.dashapp_keymarket.id.toString(),
            );
            return exactSetMatch(athletePrimaryIds, requiredPrimaryIds);
        });
    }

    // 6. Exact filtering for dashapp_athlete_key_markets_secondary
    if (secondaryMarketIds?.length) {
        const requiredSecondaryIds = secondaryMarketIds.map((id) => BigInt(id).toString());
        filteredAthletes = filteredAthletes.filter((athlete) => {
            // Assuming relation field is an array of objects with dashapp_keymarket.
            const athleteSecondaryIds = athlete.dashapp_athlete_key_markets_secondary.map((entry: any) =>
                entry.dashapp_keymarket.id.toString(),
            );
            return exactSetMatch(athleteSecondaryIds, requiredSecondaryIds);
        });
    }

    // 7. Exact filtering for dashapp_athlete_key_markets_tertiary
    if (tertiaryIds?.length) {
        const requiredTertiaryIds = tertiaryIds.map((id) => BigInt(id).toString());
        filteredAthletes = filteredAthletes.filter((athlete) => {
            // Assuming athlete.dashapp_athlete_key_markets_tertiary is an array of objects with dashapp_states.
            const athleteTertiaryIds = athlete.dashapp_athlete_key_markets_tertiary.map((entry: any) =>
                entry.dashapp_states.id.toString(),
            );
            return exactSetMatch(athleteTertiaryIds, requiredTertiaryIds);
        });
    }

    const modifiedAthletes =
        genderIds?.length === 2
            ? filteredAthletes.filter((athlete) => athlete.dashapp_athlete_target_gender.length === 2)
            : filteredAthletes;

    const athleteResponse: AthleteResponseDTO[] = modifiedAthletes.map((athlete) =>
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

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_leagueinfo_personality_traits: {
                        some: { leagueinfo_id: { in: leagues.map((league) => league.id) } },
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
                            leagueinfo_id: { in: leagues.map((league) => league.id) },
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

    const updatedLeagues = leagues.map((league) => ({
        ...league,
        mainPersonalities: personalitiesByleagueId[league.id.toString()] || [],
    }));

    let filteredLeagues = updatedLeagues;

    // 1. Exact filtering for dashapp_leagueinfo_age
    if (ageIds?.length) {
        const requiredAgeIds = ageIds.map((id) => BigInt(id).toString());
        filteredLeagues = filteredLeagues.filter((league) => {
            const leagueAgeIds = league.dashapp_leagueinfo_age
                .map((entry: any) => {
                    return entry.dashapp_age?.id?.toString();
                })
                .filter(Boolean);
            return exactSetMatch(leagueAgeIds, requiredAgeIds);
        });
    }

    // 2. Exact filtering for dashapp_leagueinfo_personality_traits
    if (subPersonalityTraitIds?.length) {
        const requiredSubPersonalityTraitIds = subPersonalityTraitIds.map((id) => BigInt(id).toString());
        filteredLeagues = filteredLeagues.filter((league) => {
            const leagueSubPersonalityTraitIds = league.mainPersonalities.flatMap((entry: any) => {
                return entry.dashapp_subpersonality?.map((sub: any) => {
                    return sub.id.toString();
                });
            });
            return exactSetMatch(leagueSubPersonalityTraitIds, requiredSubPersonalityTraitIds);
        });
    }

    // 3. Exact filtering for dashapp_leagueinfo_income
    if (nccsIds?.length) {
        const requiredNccsIds = nccsIds.map((id) => BigInt(id).toString());
        filteredLeagues = filteredLeagues.filter((league) => {
            const leagueNccsIds = league.dashapp_leagueinfo_income.map((entry: any) => {
                return entry.dashapp_nccs.id.toString();
            });
            return exactSetMatch(leagueNccsIds, requiredNccsIds);
        });
    }

    // 4. Exact filtering for dashapp_leagueinfo_key_markets_primary
    if (primaryMarketIds?.length) {
        const requiredPrimaryIds = primaryMarketIds.map((id) => BigInt(id).toString());
        filteredLeagues = filteredLeagues.filter((league) => {
            const leaguePrimaryIds = league.dashapp_leagueinfo_key_markets_primary.map((entry: any) => {
                return entry.dashapp_keymarket.id.toString();
            });
            return exactSetMatch(leaguePrimaryIds, requiredPrimaryIds);
        });
    }

    // 5. Exact filtering for dashapp_leagueinfo_key_markets_secondary
    if (secondaryMarketIds?.length) {
        const requiredSecondaryIds = secondaryMarketIds.map((id) => BigInt(id).toString());
        filteredLeagues = filteredLeagues.filter((league) => {
            const leagueSecondaryIds = league.dashapp_leagueinfo_key_markets_secondary.map((entry: any) => {
                return entry.dashapp_keymarket.id.toString();
            });
            return exactSetMatch(leagueSecondaryIds, requiredSecondaryIds);
        });
    }

    // 6. Exact filtering for dashapp_leagueinfo_key_markets_tertiary
    if (tertiaryIds?.length) {
        const requiredTertiaryIds = tertiaryIds.map((id) => BigInt(id).toString());
        filteredLeagues = filteredLeagues.filter((league) => {
            const leagueTertiaryIds = league.dashapp_leagueinfo_key_markets_tertiary.map((entry: any) => {
                return entry.dashapp_states.id.toString();
            });
            return exactSetMatch(leagueTertiaryIds, requiredTertiaryIds);
        });
    }

    // 7. Exact filtering for dashapp_leagueinfo_tier
    if (tierIds?.length) {
        const requiredTierIds = tierIds.map((id) => BigInt(id).toString());
        filteredLeagues = filteredLeagues.filter((league) => {
            const leagueTierIds = league.dashapp_leagueinfo_tier
                .map((entry: any) => {
                    return entry.dashapp_tier?.id?.toString();
                })
                .filter(Boolean);
            return exactSetMatch(leagueTierIds, requiredTierIds);
        });
    }

    const modifiedLeagues =
        genderIds?.length === 2
            ? filteredLeagues.filter((league) => league.dashapp_leagueinfo_gender.length === 2)
            : filteredLeagues;

    const leagueResponse: LeagueResponseDTO[] = modifiedLeagues.map((league) =>
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

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_team_personality_traits: {
                        some: { team_id: { in: teams.map((team) => team.id) } },
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
                            team_id: { in: teams.map((team) => team.id) },
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

    const updatedTeams = teams.map((team) => ({
        ...team,
        mainPersonalities: personalitiesByTeamId[team.id.toString()] || [],
    }));

    let filteredTeams = updatedTeams;

    // 1. Exact filtering for dashapp_team_age
    if (ageIds?.length) {
        const requiredAgeIds = ageIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_age || !Array.isArray(team.dashapp_team_age)) return false;
            const teamAgeIds = team.dashapp_team_age
                .map((entry: any) => entry?.dashapp_age?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamAgeIds, requiredAgeIds);
        });
    }

    // 2. Exact filtering for dashapp_team_personality_traits
    if (subPersonalityTraitIds?.length) {
        const requiredSubPersonalityTraitIds = subPersonalityTraitIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.mainPersonalities || !Array.isArray(team.mainPersonalities)) return false;
            const teamSubPersonalityTraitIds = team.mainPersonalities
                .flatMap((entry: any) => {
                    if (!entry.dashapp_subpersonality || !Array.isArray(entry.dashapp_subpersonality)) return [];
                    return entry.dashapp_subpersonality
                        .map((sub: any) => {
                            return sub?.id?.toString();
                        })
                        .filter(Boolean);
                })
                .filter(Boolean);
            return exactSetMatch(teamSubPersonalityTraitIds, requiredSubPersonalityTraitIds);
        });
    }

    // 3. Exact filtering for dashapp_team_income
    if (nccsIds?.length) {
        const requiredNccsIds = nccsIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_income || !Array.isArray(team.dashapp_team_income)) return false;
            const teamNccsIds = team.dashapp_team_income
                .map((entry: any) => entry?.dashapp_nccs?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamNccsIds, requiredNccsIds);
        });
    }

    // 4. Exact filtering for dashapp_team_key_markets_primary
    if (primaryMarketIds?.length) {
        const requiredKeyPrimaryIds = primaryMarketIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_key_markets_primary || !Array.isArray(team.dashapp_team_key_markets_primary))
                return false;
            const teamKeyPrimaryIds = team.dashapp_team_key_markets_primary
                .map((entry: any) => entry?.dashapp_keymarket?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamKeyPrimaryIds, requiredKeyPrimaryIds);
        });
    }

    // 5. Exact filtering for dashapp_team_key_markets_secondary
    if (secondaryMarketIds?.length) {
        const requiredKeySecondaryIds = secondaryMarketIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_key_markets_secondary || !Array.isArray(team.dashapp_team_key_markets_secondary))
                return false;
            const teamKeySecondaryIds = team.dashapp_team_key_markets_secondary
                .map((entry: any) => entry?.dashapp_keymarket?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamKeySecondaryIds, requiredKeySecondaryIds);
        });
    }

    // 6. Exact filtering for dashapp_team_key_markets_tertiary
    if (tertiaryIds?.length) {
        const requiredTertiaryIds = tertiaryIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_key_markets_tertiary || !Array.isArray(team.dashapp_team_key_markets_tertiary))
                return false;
            const teamTertiaryIds = team.dashapp_team_key_markets_tertiary
                .map((entry: any) => entry?.dashapp_states?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamTertiaryIds, requiredTertiaryIds);
        });
    }

    // 7. Exact filtering for dashapp_team_tier
    if (tierIds?.length) {
        const requiredTierIds = tierIds.map((id) => BigInt(id).toString());
        filteredTeams = filteredTeams.filter((team) => {
            if (!team.dashapp_team_tier || !Array.isArray(team.dashapp_team_tier)) return false;
            const teamTierIds = team.dashapp_team_tier
                .map((entry: any) => entry?.dashapp_tier?.id?.toString())
                .filter(Boolean);
            return exactSetMatch(teamTierIds, requiredTierIds);
        });
    }

    const modifiedTeams =
        genderIds?.length === 2
            ? filteredTeams.filter((team) => team?.dashapp_team_gender?.length === 2)
            : filteredTeams;

    const teamResponse: TeamResponseDTO[] = modifiedTeams.map((team) =>
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
