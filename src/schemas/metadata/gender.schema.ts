import z from "zod";

export const createGenderSchema = z.object({
  userId: z.string(),
  gender: z.string(),
});

export const editGenderSchema = createGenderSchema;

export type TCreateGenderSchema = z.infer<typeof createGenderSchema>;

export type TEditGenderSchema = z.infer<typeof editGenderSchema>;
