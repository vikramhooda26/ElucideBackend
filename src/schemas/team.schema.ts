import z from "zod";

export const createTeamSchema = z.object({
    teamName: z.string(),
    yearOfInception: z.string().optional(),
    sportId: z.number().optional(),
    leagueId: z.number().optional(),
    teamOwnerIds: z.number().array().optional(),
    franchiseFee: z.number().optional(),
    hqCityId: z.number().optional(),
    hqStateId: z.number().optional(),
    personalityTraitIds: z.number().array().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    tierIds: z.number().array().optional(),
    strategyOverview: z.string().optional(),
    taglineIds: z.number().array().optional(),
    activeCampaignIds: z.number().array().optional(),
    marketingPlatformPrimaryIds: z.number().array().optional(),
    marketingPlatformSecondaryIds: z.number().array().optional(),
    ageIds: z.number().array().optional(),
    genderIds: z.number().array().optional(),
    primaryMarketIds: z.number().array().optional(),
    secondaryMarketIds: z.number().array().optional(),
    tertiaryIds: z.number().array().optional(),
    incomeIds: z.number().array().optional(),
    associationId: z.number().optional(),
    metrics: z
        .object({
            viewership: z.string().optional(),
            reach: z.string().optional(),
            year: z.string().optional(),
            viewshipType: z.enum(["OTT", "BROADCAST"]).optional(),
        })
        .array()
        .optional(),
});

export const editTeamSchema = createTeamSchema.partial();

export type TCreateTeamSchema = z.infer<typeof createTeamSchema>;
export type TEditTeamSchema = z.infer<typeof editTeamSchema>;
