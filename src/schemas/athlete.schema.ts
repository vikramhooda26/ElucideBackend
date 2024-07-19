import z from "zod";

export const createAthleteSchema = z.object({
    athleteName: z.string().min(1, "Required"),
    associationId: z.number().optional(),
    userId: z.number().min(1, "Required"),
    sportId: z.number().min(1, "Required"),
    agencyId: z.number().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    subPersonalityTraitIds: z.number().array().optional(),
    ageId: z.number().optional(),
    genderId: z.number().optional(),
    incomeId: z.number().optional(),
    primaryMarketIds: z.number().array().optional(),
    secondaryMarketIds: z.number().array().optional(),
    tertiaryIds: z.number().array().optional(),
    nationality: z.string().optional(),
});

export const editAthleteSchema = createAthleteSchema.partial();

export type TCreateAthleteSchema = z.infer<typeof createAthleteSchema>;
export type TEditAthleteSchema = z.infer<typeof editAthleteSchema>;
