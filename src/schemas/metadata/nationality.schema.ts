import z from "zod";

export const createNationalitySchema = z.object({
    userId: z.string(),
    nationality: z.string(),
});

export const editNationalitySchema = createNationalitySchema;

export type TCreateNationalitySchema = z.infer<typeof createNationalitySchema>;

export type TEditNationalitySchema = z.infer<typeof editNationalitySchema>;
