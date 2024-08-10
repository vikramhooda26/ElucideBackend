import z from "zod";

export const createAthleteSchema = z.object({
    name: z.string().min(1, "Required"),
    associationLevelId: z.string().optional(),
    costOfAssociation: z.number().optional(),
    userId: z.string().min(1, "Required"),
    sportId: z.string().optional(),
    agencyId: z.string().optional(),
    age: z.date().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    subPersonalityTraitIds: z.string().array().optional(),
    genderIds: z.string().array().optional(),
    nccsIds: z.string().array().optional(),
    primaryMarketIds: z.string().array().optional(),
    tierIds: z.string().array().optional(),
    secondaryMarketIds: z.string().array().optional(),
    tertiaryIds: z.string().array().optional(),
    stateId: z.string().optional(),
    nationalityId: z.string().optional(),
    primarySocialMediaPlatformIds: z.string().array().optional(),
    secondarySocialMediaPlatformIds: z.string().array().optional(),
    statusId: z.string().optional(),
    contactName: z.string().optional(),
    contactDesignation: z.string().optional(),
    contactEmail: z.string().optional(),
    contactNumber: z.string().optional(),
    contactLinkedin: z.string().optional(),
});

export const editAthleteSchema = createAthleteSchema.partial().extend({
    associationId: z.string().optional(),
    contactId: z.string().optional(),
    userId: z.string(),
});

export const filteredAthleteSchema = z.object({
    name: z.string().optional(),
    associationLevelIds: z.string().array().optional(),
    costOfAssociation: z
        .object({
            operationType: z.enum(["range", "gte", "lte", "equals"]),
            cost: z.bigint(),
        })
        .optional(),
    createdByIds: z.string().array().optional(),
    modifiedByIds: z.string().array().optional(),
    sportIds: z.string().array().optional(),
    age: z.string().optional(),
    ageRangeIds: z.string().array().optional(),
    personalityTraitIds: z.string().array().optional(),
    subpersonalityTraitIds: z.string().array().optional(),
    genderIds: z.string().array().optional(),
    nccsIds: z.string().array().optional(),
    primaryMarketIds: z.string().array().optional(),
    secondaryMarketIds: z.string().array().optional(),
    tertiaryMarketIds: z.string().array().optional(),
    nationalityIds: z.string().array().optional(),
    primarySocialMediaIds: z.string().array().optional(),
    secondarySocialMediaIds: z.string().array().optional(),
});

export type TCreateAthleteSchema = z.infer<typeof createAthleteSchema>;
export type TEditAthleteSchema = z.infer<typeof editAthleteSchema>;
export type TFilteredAthleteSchema = z.infer<typeof filteredAthleteSchema>;
