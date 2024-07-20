import z, { array } from "zod";

export const createBrandSchema = z.object({
    companyName: z.string(),
    parentOrgId: z.number().optional(),
    subCategoryIds: z.number().array().optional(),
    hqCityId: z.number().optional(),
    hqStateId: z.number().optional(),
    agencyId: z.number().optional(),
    tierIds: z.number().array().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    personalityTraitIds: z.number().array().optional(),
    strategyOverview: z.string().optional(),
    taglineIds: z.number().array().optional(),
    activeCampaignIds: z.number().array().optional(),
    primaryMarketIds: z.number().array().optional(),
    secondaryMarketIds: z.number().array().optional(),
    tertiaryIds: z.number().array().optional(),
    incomeIds: z.number().array().optional(),
    marketingPlatformPrimaryIds: z.number().array().optional(),
    marketingPlatformSecondaryIds: z.number().array().optional(),
    ageIds: z.number().array().optional(),
    genderIds: z.number().array().optional(),
});

export const editBrandSchema = createBrandSchema.partial();

export type TCreateBrandSchema = z.infer<typeof createBrandSchema>;
export type TEditBrandSchema = z.infer<typeof editBrandSchema>;
