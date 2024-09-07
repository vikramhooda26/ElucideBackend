import z from "zod";

export const createBrandSchema = z.object({
    name: z.string(),
    userId: z.string(),
    parentOrgId: z.string().optional(),
    subCategoryIds: z.string().array().optional(),
    cityId: z.string().optional(),
    stateId: z.string().optional(),
    agencyId: z.string().optional(),
    tierIds: z.string().array().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    subPersonalityTraitIds: z.string().array().optional(),
    strategyOverview: z.string().optional(),
    taglineIds: z.string().array().optional(),
    activeCampaignIds: z.string().array().optional(),
    primaryMarketIds: z.string().array().optional(),
    secondaryMarketIds: z.string().array().optional(),
    tertiaryIds: z.string().array().optional(),
    nccsIds: z.string().array().optional(),
    primaryMarketingPlatformIds: z.string().array().optional(),
    secondaryMarketingPlatformIds: z.string().array().optional(),
    ageIds: z.string().array().optional(),
    genderIds: z.string().array().optional(),
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

export const editBrandSchema = createBrandSchema.partial().extend({
    name: z.string(),
    userId: z.string(),
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
    endorsements: z
        .object({
            name: z.string(),
            active: z.boolean(),
        })
        .array()
        .optional(),
});

export type TCreateBrandSchema = z.infer<typeof createBrandSchema>;
export type TEditBrandSchema = z.infer<typeof editBrandSchema>;
