import z from "zod";

export const createLeagueSchema = z.object({
    name: z.string().min(1, "Required"),
    sportId: z.string().optional(),
    ownerIds: z.string().array().optional(),
    subPersonalityTraitIds: z.string().array().optional(),
    tierIds: z.string().array().optional(),
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
    viewershipMetrics: z
        .object({
            id: z.string().optional(),
            viewership: z.string(),
            year: z.string(),
            viewershipType: z.enum(["OTT", "BROADCAST"]),
        })
        .array()
        .optional(),
    reachMetrics: z
        .object({
            id: z.string().optional(),
            reach: z.string(),
            year: z.string(),
        })
        .array()
        .optional(),
    associationLevelId: z.string().optional(),
    costOfAssociation: z.number().optional(),
    contactPerson: z
        .object({
            contactName: z.string(),
            contactDesignation: z.string().optional(),
            contactEmail: z.string().optional(),
            contactNumber: z.string().optional(),
            contactLinkedin: z.string().optional(),
        })
        .array()
        .optional(),
    userId: z.string(),
});

export const editLeagueSchema = createLeagueSchema.partial().extend({
    associationId: z.string().optional(),
    contactPerson: z
        .object({
            contactId: z.string().optional(),
            contactName: z.string(),
            contactDesignation: z.string().optional(),
            contactEmail: z.string().optional(),
            contactNumber: z.string().optional(),
            contactLinkedin: z.string().optional(),
        })
        .array()
        .optional(),
    userId: z.string(),
});

export type TCreateLeagueSchema = z.infer<typeof createLeagueSchema>;
export type TEditLeagueSchema = z.infer<typeof editLeagueSchema>;
