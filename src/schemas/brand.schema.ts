import z from "zod";

export const createBrandSchema = z.object({
    companyName: z.string(),
    parentOrgId: z.string().optional(),
    subCategoryIds: z.string().array().optional(),
    hqCityId: z.string().optional(),
    hqStateId: z.string().optional(),
    agencyId: z.string().optional(),
    tierIds: z.string().array().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    personalityTraitIds: z.string().array().optional(),
    strategyOverview: z.string().optional(),
    taglineIds: z.string().array().optional(),
    activeCampaignIds: z.string().array().optional(),
    primaryMarketIds: z.string().array().optional(),
    secondaryMarketIds: z.string().array().optional(),
    tertiaryIds: z.string().array().optional(),
    incomeIds: z.string().array().optional(),
    marketingPlatformPrimaryIds: z.string().array().optional(),
    marketingPlatformSecondaryIds: z.string().array().optional(),
    ageIds: z.string().array().optional(),
    genderIds: z.string().array().optional(),
});

export const editBrandSchema = createBrandSchema.partial();

export type TCreateBrandSchema = z.infer<typeof createBrandSchema>;
export type TEditBrandSchema = z.infer<typeof editBrandSchema>;
