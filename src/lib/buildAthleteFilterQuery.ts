import { TFilteredAthleteSchema } from "../schemas/athlete.schema.js";
import { convertStringToBigInt, convertStringToInt } from "./helpers.js";

/**
 * @todo
 * Validate cost of association since it can be an array of different ranges
 */

export const buildAthleteFilterQuery = (filters: TFilteredAthleteSchema) => {
    const {
        age,
        ageRangeIds,
        associationLevelIds,
        athleteName,
        costOfAssociation,
        createdByIds,
        genderIds,
        modifiedByIds,
        nationalityIds,
        nccsIds,
        personalityTraitIds,
        primaryMarketIds,
        primarySocialMediaIds,
        secondaryMarketIds,
        secondarySocialMediaIds,
        sportIds,
        subpersonalityTraitIds,
        tertiaryMarketIds,
    } = filters as TFilteredAthleteSchema;

    const conditions: any[] = [];

    if (age)
        conditions.push({
            age: { in: age.map((v) => convertStringToInt(v)) },
        });
    if (ageRangeIds)
        conditions.push({
            dashapp_athlete_target_age: {
                some: {
                    dashapp_age: {
                        age_range: {
                            in: ageRangeIds.map((range) =>
                                convertStringToBigInt(range),
                            ),
                        },
                    },
                },
            },
        });
    if (associationLevelIds)
        conditions.push({
            association_level: {
                in: associationLevelIds.map((level) =>
                    convertStringToBigInt(level),
                ),
            },
        });
    if (athleteName)
        conditions.push({
            athlete_name: { contains: athleteName, mode: "insensitive" },
        });
    if (costOfAssociation)
        conditions.push({
            cost_of_association: { in: costOfAssociation },
        });
    if (createdByIds)
        conditions.push({
            created_by: { id: { in: createdByIds.map((v) => BigInt(v)) } },
        });
    if (genderIds)
        conditions.push({
            dashapp_athlete_target_gender: {
                some: {
                    dashapp_gender: {
                        id: { in: genderIds.map((v) => BigInt(v)) },
                    },
                },
            },
        });
    if (modifiedByIds)
        conditions.push({
            modified_by: { id: { in: modifiedByIds.map((v) => BigInt(v)) } },
        });
    if (nationalityIds)
        conditions.push({
            nationality: { id: { in: nationalityIds.map((v) => BigInt(v)) } },
        });
    if (nccsIds)
        conditions.push({
            dashapp_athlete_target_income: {
                some: {
                    dashapp_nccs: { id: { in: nccsIds.map((v) => BigInt(v)) } },
                },
            },
        });
    if (personalityTraitIds)
        conditions.push({ personality_trait: { in: personalityTraitIds } });
    if (primaryMarketIds)
        conditions.push({
            dashapp_athlete_key_markets_primary: {
                some: {
                    dashapp_keymarket: {
                        id: { in: primaryMarketIds.map((v) => BigInt(v)) },
                    },
                },
            },
        });
    if (primarySocialMediaIds)
        conditions.push({
            dashapp_athlete_socialmedia_platform_primary: {
                some: {
                    dashapp_socialmedia_platform: {
                        id: { in: primarySocialMediaIds.map((v) => BigInt(v)) },
                    },
                },
            },
        });
    if (secondaryMarketIds)
        conditions.push({
            dashapp_athlete_key_markets_secondary: {
                some: {
                    dashapp_keymarket: {
                        id: { in: secondaryMarketIds.map((v) => BigInt(v)) },
                    },
                },
            },
        });
    if (secondarySocialMediaIds)
        conditions.push({
            dashapp_athlete_socialmedia_platform_secondary: {
                some: {
                    dashapp_socialmedia_platform: {
                        id: {
                            in: secondarySocialMediaIds.map((v) => BigInt(v)),
                        },
                    },
                },
            },
        });
    if (sportIds)
        conditions.push({ sport_id: { in: sportIds.map((v) => BigInt(v)) } });
    if (subpersonalityTraitIds)
        conditions.push({
            dashapp_athlete_personality_traits: {
                some: {
                    dashapp_subpersonality: {
                        id: {
                            in: subpersonalityTraitIds.map((v) => BigInt(v)),
                        },
                    },
                },
            },
        });
    if (tertiaryMarketIds)
        conditions.push({
            dashapp_athlete_key_markets_tertiary: {
                some: {
                    dashapp_states: {
                        id: { in: tertiaryMarketIds.map((v) => BigInt(v)) },
                    },
                },
            },
        });

    return conditions;
};
