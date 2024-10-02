import z from "zod";

export const filteredStakeholdersSchema = z.object({
    subPersonalityTraitIds: z.string().array().optional(),
    tierIds: z.string().array().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    strategyOverview: z.string().optional(),
    primaryMarketingPlatformIds: z.string().array().optional(),
    secondaryMarketingPlatformIds: z.string().array().optional(),
    ageIds: z.string().array().optional(),
    genderIds: z.string().array().optional(),
    primaryMarketIds: z.string().array().optional(),
    secondaryMarketIds: z.string().array().optional(),
    tertiaryIds: z.string().array().optional(),
    nccsIds: z.string().array().optional(),
    contactName: z.string().optional(),
    contactDesignation: z.string().optional(),
    contactEmail: z.string().optional(),
    contactNumber: z.string().optional(),
    contactLinkedin: z.string().optional(),
    isMandatory: z.boolean({ message: "isMandatory is required" }),
});

export type TFilteredStakeholdersSchema = z.infer<typeof filteredStakeholdersSchema>;
