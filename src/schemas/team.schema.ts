import z from "zod";

export const createTeamSchema = z.object({
    name: z.string(),
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
    association: z
        .object({
            associationLevelId: z.string(),
            costOfAssociation: z.number().optional(),
            brandIds: z.string().array().optional(),
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

export const editTeamSchema = createTeamSchema.partial().extend({
    association: z
        .object({
            associationId: z.string(),
            associationLevelId: z.string(),
            costOfAssociation: z.number().optional(),
            brandIds: z.string().array().optional(),
        })
        .array()
        .optional(),
    contactPerson: z
        .object({
            contactId: z.string(),
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

export type TCreateTeamSchema = z.infer<typeof createTeamSchema>;
export type TEditTeamSchema = z.infer<typeof editTeamSchema>;
