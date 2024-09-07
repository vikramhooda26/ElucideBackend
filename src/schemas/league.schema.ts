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
    endorsements: z
        .object({
            name: z.string(),
            active: z.boolean(),
        })
        .array()
        .optional(),
    ottPartnerMetrics: z
        .object({
            id: z.string().optional(),
            reach: z.string().optional(),
            viewership: z.string().optional(),
            year: z.string(),
            ottPartnerId: z.string(),
        })
        .array()
        .optional(),
    broadcastPartnerMetrics: z
        .object({
            id: z.string().optional(),
            reach: z.string().optional(),
            viewership: z.string().optional(),
            year: z.string(),
            broadcastPartnerId: z.string(),
        })
        .array()
        .optional(),
    association: z
        .object({
            associationLevelId: z.string(),
            costOfAssociation: z.number().optional(),
        })
        .array()
        .optional(),
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
});

export const editLeagueSchema = createLeagueSchema.partial().extend({
    name: z.string(),
    association: z
        .object({
            associationLevelId: z.string(),
            costOfAssociation: z.number().optional(),
        })
        .array()
        .optional(),
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
    endorsements: z
        .object({
            name: z.string(),
            active: z.boolean(),
        })
        .array()
        .optional(),
});

export type TCreateLeagueSchema = z.infer<typeof createLeagueSchema>;
export type TEditLeagueSchema = z.infer<typeof editLeagueSchema>;
