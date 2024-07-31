import z from "zod";

export const createAgencySchema = z.object({
    agencyName: z.string(),
    userId: z.string(),
});

export const editAgencySchema = createAgencySchema;

export type TCreateAgencySchema = z.infer<typeof createAgencySchema>;
export type TEditAgencySchema = z.infer<typeof editAgencySchema>;
