import z from "zod";

export const createAthleteStatusSchema = z.object({
    userId: z.string(),
    status: z.string(),
});

export const editAthleteStatusSchema = createAthleteStatusSchema;

export type TCreateAthleteStatusSchema = z.infer<typeof createAthleteStatusSchema>;

export type TEditAthleteStatusSchema = z.infer<typeof editAthleteStatusSchema>;
