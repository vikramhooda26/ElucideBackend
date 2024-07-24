import z from "zod";

export const createAthleteSchema = z.object({
    athleteName: z.string().min(1, "Required"),
    associationId: z.string().optional(),
    userId: z.string().min(1, "Required"),
    sportId: z.string().min(1, "Required"),
    agencyId: z.string().optional(),
    age: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    subPersonalityTraitIds: z.string().array().optional(),
    genderId: z.string().optional(),
    incomeId: z.string().optional(),
    primaryMarketIds: z.string().array().optional(),
    secondaryMarketIds: z.string().array().optional(),
    tertiaryIds: z.string().array().optional(),
    nationality: z.string().optional(),
});

export const editAthleteSchema = createAthleteSchema.partial();

export type TCreateAthleteSchema = z.infer<typeof createAthleteSchema>;
export type TEditAthleteSchema = z.infer<typeof editAthleteSchema>;
