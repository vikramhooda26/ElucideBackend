import z from "zod";

export const createAgeRangeSchema = z.object({
    ageRange: z.string(),
    userId: z.string(),
});

export const editAgeRangeSchema = createAgeRangeSchema;

export type TCreateAgeRangeSchema = z.infer<typeof createAgeRangeSchema>;
export type TEditAgeRangeSchema = z.infer<typeof editAgeRangeSchema>;
