import z from "zod";

export const createLeagueSchema = z.object({
    propertyName: z.string().min(1, "Required"),
    sportId: z.string().optional(),
    leagueOwnerIds: z.string().array().optional(),
    personalityTraitIds: z.string().array().optional(),
    tierIds: z.string().array().optional(),
    taglineIds: z.string().array().optional(),
    activeCampaignIds: z.string().array().optional(),
    marketingPlatformPrimaryIds: z.string().array().optional(),
    marketingPlatformSecondaryIds: z.string().array().optional(),
    ageIds: z.string().array().optional(),
    genderIds: z.string().array().optional(),
    primaryMarketIds: z.string().array().optional(),
    secondaryMarketIds: z.string().array().optional(),
    tertiaryIds: z.string().array().optional(),
    incomeIds: z.string().array().optional(),
    yearOfInception: z.string().optional(),
    formatId: z.string().optional(),
    broadCastPartnerId: z.string().optional(),
    ottPartnerId: z.string().optional(),
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
    associationId: z.string().optional(),
});

export const editLeagueSchema = createLeagueSchema.partial();

export type TCreateLeagueSchema = z.infer<typeof createLeagueSchema>;
export type TEditLeagueSchema = z.infer<typeof editLeagueSchema>;
