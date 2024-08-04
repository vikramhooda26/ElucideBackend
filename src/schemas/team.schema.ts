import z from "zod";

export const createTeamSchema = z.object({
    name: z.string(),
    userId: z.string(),
    yearOfInception: z.string().optional(),
    sportId: z.string().optional(),
    leagueId: z.string().optional(),
    ownerIds: z.string().array().optional(),
    franchiseFee: z.number().optional(),
    cityId: z.string().optional(),
    stateId: z.string().optional(),
    subPersonalityTraitIds: z.string().array().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    tierIds: z.string().array().optional(),
    strategyOverview: z.string().optional(),
    taglineIds: z.string().array().optional(),
    activeCampaignIds: z.string().array().optional(),
    primaryMarketingPlatformIds: z.string().array().optional(),
    secondaryMarketingPlatformIds: z.string().array().optional(),
    ageIds: z.string().array().optional(),
    genderIds: z.string().array().optional(),
    primaryMarketIds: z.string().array().optional(),
    secondaryMarketIds: z.string().array().optional(),
    tertiaryIds: z.string().array().optional(),
    nccsIds: z.string().array().optional(),
    associationLevelId: z.string().optional(),
    costOfAssociation: z.number().optional(),
    viewershipMetrics: z
        .object({
            viewership: z.string(),
            year: z.string(),
            viewershipType: z.enum(["OTT", "BROADCAST"]),
        })
        .array()
        .optional(),
    reachMetrics: z
        .object({
            reach: z.string(),
            year: z.string(),
        })
        .array()
        .optional(),
    contactName: z.string().optional(),
    contactDesignation: z.string().optional(),
    contactEmail: z.string().optional(),
    contactNumber: z.string().optional(),
    contactLinkedin: z.string().optional(),
});

export const editTeamSchema = createTeamSchema.partial().extend({
    associationId: z.string().optional(),
    contactId: z.string().optional(),
    userId: z.string(),
});

export type TCreateTeamSchema = z.infer<typeof createTeamSchema>;
export type TEditTeamSchema = z.infer<typeof editTeamSchema>;
