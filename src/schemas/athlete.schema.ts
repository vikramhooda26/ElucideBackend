import z from "zod";

export const createAthleteSchema = z.object({
    name: z.string().min(1, "Required"),
    association: z
        .object({
            associationLevelId: z.string(),
            costOfAssociation: z.number().optional(),
        })
        .array()
        .optional(),
    userId: z.string().min(1, "Required"),
    strategyOverview: z.string().optional(),
    sportId: z.string().optional(),
    agencyId: z.string().optional(),
    athleteAge: z.string().optional(),
    ageIds: z.string().array().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    subPersonalityTraitIds: z.string().array().optional(),
    genderIds: z.string().array().optional(),
    athleteGenderId: z.string().optional(),
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

export const editAthleteSchema = createAthleteSchema.partial().extend({
    association: z
        .object({
            associationId: z.string().optional(),
            associationLevelId: z.string(),
            costOfAssociation: z.number().optional(),
        })
        .array()
        .optional(),
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
