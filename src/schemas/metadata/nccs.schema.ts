import z from "zod";

export const createNccsSchema = z.object({
    userId: z.string(),
    nccsClass: z.string(),
});

export const editNccsSchema = createNccsSchema;

export type TCreateNccsSchema = z.infer<typeof createNccsSchema>;

export type TEditNccsSchema = z.infer<typeof editNccsSchema>;
