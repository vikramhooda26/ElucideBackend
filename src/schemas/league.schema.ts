import z from "zod";

export const createLeagueSchema = z.object({
    propertyName: z.string().min(1, "Required"),
    sportId: z.number().optional(),
    leagueOwnerIds: z.number().array().optional(),
    personalityTraitIds: z.number().array().optional(),
    tierIds: z.number().array().optional(),
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
    yearOfInception: z.string().optional(),
    format: z.string().optional(),
    broadCastPartnerId: z.number().optional(),
    ottPartnerId: z.number().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    strategyOverview: z.string().optional(),
    metrics: z
        .object({
            viewership: z.string().optional(),
            reach: z.string().optional(),
            year: z.string().optional(),
            viewshipType: z.enum(["OTT", "BROADCAST"]).optional(),
        })
        .array()
        .optional(),
    associationId: z.number().optional(),
});

export const editLeagueSchema = createLeagueSchema.partial();

export type TCreateLeagueSchema = z.infer<typeof createLeagueSchema>;
export type TEditLeagueSchema = z.infer<typeof editLeagueSchema>;
