import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { ActivationResponseDTO } from "../../dto/activation.dto.js";
import { AthleteResponseDTO } from "../../dto/athlete.dto.js";
import { BrandResponseDTO } from "../../dto/brand.dto.js";
import { LeagueResponseDTO } from "../../dto/league.dto.js";
import { SportsDealSummaryResponseDTO } from "../../dto/sports-deal-summary.dto.js";
import { TeamResponseDTO } from "../../dto/team.dto.js";
import { STATUS_CODE } from "../../lib/constants.js";
import { activationSelect } from "../../types/activation.type.js";
import { athleteSelect, TAthleteDetails } from "../../types/athlete.type.js";
import { brandSelect, TBrandDetails } from "../../types/brand.type.js";
import { leagueSelect, TLeagueDetails } from "../../types/league.type.js";
import { sportsDealSummarySelect } from "../../types/sports-deal-summary.type.js";
import { teamSelect, TTeamDetails } from "../../types/team.type.js";
import { getAthletes } from "../athlete.controller.js";
import { getBrands } from "../brand.controller.js";
import { getAthletesCount, getBrandsCount, getLeaguesCount, getTeamsCount } from "../dashboard/helpers.js";
import { getLeagues } from "../league.controller.js";
import { getTeams } from "../team.controller.js";

const getAllBrands = asyncHandler(async (req, res) => {
    const [brands, totalNumberOfBrands] = await Promise.all([getBrands({ select: brandSelect }), getBrandsCount()]);

    const mainCategories = await prisma.dashapp_category.findMany({
        where: {
            dashapp_subcategory: {
                some: {
                    dashapp_companydata_subcategory: {
                        some: { companydata_id: { in: brands.map((x) => x.id) } },
                    },
                },
            },
        },
        select: {
            id: true,
            category: true,
            dashapp_subcategory: {
                select: {
                    id: true,
                    subcategory: true,
                    dashapp_companydata_subcategory: {
                        select: {
                            companydata_id: true,
                        },
                    },
                },
            },
        },
    });

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_companydata_personality_traits: {
                        some: { companydata_id: { in: brands.map((x) => x.id) } },
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            dashapp_subpersonality: {
                select: {
                    id: true,
                    name: true,
                    dashapp_companydata_personality_traits: {
                        select: {
                            companydata_id: true,
                        },
                    },
                },
            },
        },
    });

    const personalitiesByBrandId: Record<string, typeof mainPersonalities> = {};

    mainPersonalities.forEach((personality) => {
        const brandIds = personality.dashapp_subpersonality
            .flatMap((sub) => sub.dashapp_companydata_personality_traits.map((trait) => trait.companydata_id))
            .filter(Boolean);
        brandIds.forEach((brandId) => {
            const brandIdStr = brandId.toString();
            if (!personalitiesByBrandId[brandIdStr]) {
                personalitiesByBrandId[brandIdStr] = [];
            }

            const alreadyAdded = personalitiesByBrandId[brandIdStr].some((p) => p.id === personality.id);

            if (!alreadyAdded) {
                personalitiesByBrandId[brandIdStr].push(personality);
            }
        });
    });

    const categoriesByBrandId: Record<string, typeof mainCategories> = {};

    mainCategories.forEach((category) => {
        const brandIds = category.dashapp_subcategory.flatMap((sub) =>
            sub.dashapp_companydata_subcategory.map((trait) => trait?.companydata_id).filter(Boolean),
        );
        brandIds.forEach((brandId) => {
            const brandIdStr = brandId?.toString() || "";
            if (!categoriesByBrandId[brandIdStr]) {
                categoriesByBrandId[brandIdStr] = [];
            }

            const alreadyAdded = categoriesByBrandId[brandIdStr].some((p) => p.id === category.id);

            if (!alreadyAdded) {
                categoriesByBrandId[brandIdStr].push(category);
            }
        });
    });

    const updatedBrands = brands.map((brand) => ({
        ...brand,
        mainPersonalities: personalitiesByBrandId[brand?.id?.toString()] || [],
        mainCategories: categoriesByBrandId[brand?.id?.toString()] || [],
    }));

    const brandResponse: BrandResponseDTO[] = updatedBrands.map((brand) =>
        BrandResponseDTO.toResponse(brand as unknown as TBrandDetails),
    );

    res.status(STATUS_CODE.OK).json({
        totalNumberOfBrands,
        allBrandsData: brandResponse,
    });
});

const getAllAthletes = asyncHandler(async (req, res) => {
    const [athletes, totalAthletesCount] = await Promise.all([
        getAthletes({ select: athleteSelect }),
        getAthletesCount(),
    ]);

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_athlete_personality_traits: {
                        some: { athlete_id: { in: athletes.map((x) => x.id) } },
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
                        some: { athlete_id: { in: athletes.map((x) => x.id) } },
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

    const athleteResponse: AthleteResponseDTO[] = updatedAthletes.map((athlete) =>
        AthleteResponseDTO.toResponse(athlete as unknown as TAthleteDetails),
    );

    res.status(STATUS_CODE.OK).json({
        totalAthletesCount,
        allAthletesData: athleteResponse,
    });
});

const getAllTeams = asyncHandler(async (req, res) => {
    const [teams, totalTeamsCount] = await Promise.all([getTeams({ select: teamSelect }), getTeamsCount()]);

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_team_personality_traits: {
                        some: { team_id: { in: teams.map((x) => x.id) } },
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
                            team_id: { in: teams.map((x) => x.id) },
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

    const teamResponse: TeamResponseDTO[] = updatedTeams.map((team) =>
        TeamResponseDTO.toResponse(team as unknown as TTeamDetails),
    );

    res.status(STATUS_CODE.OK).json({
        totalTeamsCount,
        allTeamsData: teamResponse,
    });
});

const getAllLeagues = asyncHandler(async (req, res) => {
    const [leagues, totalLeaguesCount] = await Promise.all([getLeagues({ select: leagueSelect }), getLeaguesCount()]);

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_leagueinfo_personality_traits: {
                        some: { leagueinfo_id: { in: leagues.map((x) => x.id) } },
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
                            leagueinfo_id: { in: leagues.map((x) => x.id) },
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

    const leagueResponse: LeagueResponseDTO[] = updatedLeagues.map((league) =>
        LeagueResponseDTO.toResponse(league as unknown as TLeagueDetails),
    );

    res.status(STATUS_CODE.OK).json({
        totalLeaguesCount,
        allLeaguesData: leagueResponse,
    });
});

const getAllSportsDealSummaries = asyncHandler(async (req, res) => {
    const sportsDealSummary = await prisma.dashapp_sportsdealsummary.findMany({
        select: sportsDealSummarySelect,
    });

    const totalSportDealSummariesCount = await prisma.dashapp_sportsdealsummary.count();

    const allSportDealSummaries: SportsDealSummaryResponseDTO[] = [];

    sportsDealSummary.forEach((deal) => {
        const sportsDealSummaryResponseDTO: SportsDealSummaryResponseDTO =
            SportsDealSummaryResponseDTO.toResponse(deal);
        allSportDealSummaries.push(sportsDealSummaryResponseDTO);
    });

    res.status(STATUS_CODE.OK).json({
        totalSportDealSummariesCount,
        allSportDealSummaries,
    });
});

const getAllActivationSummaries = asyncHandler(async (req, res) => {
    const [activationSummaries, totalActivationSummariesCount] = await Promise.all([
        prisma.dashapp_activation.findMany({
            select: activationSelect,
        }),
        prisma.dashapp_activation.count(),
    ]);

    const allActivationSummaries: ActivationResponseDTO[] = [];

    activationSummaries.forEach((activation) => {
        const activationResponseDTO: ActivationResponseDTO = ActivationResponseDTO.toResponse(activation);
        allActivationSummaries.push(activationResponseDTO);
    });

    res.status(STATUS_CODE.OK).json({
        totalActivationSummariesCount,
        allActivationSummaries,
    });
});

export {
    getAllActivationSummaries,
    getAllAthletes,
    getAllBrands,
    getAllLeagues,
    getAllSportsDealSummaries,
    getAllTeams,
};
