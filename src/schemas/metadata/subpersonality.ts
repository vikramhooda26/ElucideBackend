import z from "zod";

export const createSubpersonalitySchema = z.object({
  userId: z.string(),
  subpersonalityName: z.string(),
  mainPersonalityId: z.string(),
});

export const editSubpersonalitySchema = createSubpersonalitySchema;

export type TCreateSubpersonalitySchema = z.infer<typeof createSubpersonalitySchema>;

export type TEditSubpersonalitySchema = z.infer<typeof editSubpersonalitySchema>;
