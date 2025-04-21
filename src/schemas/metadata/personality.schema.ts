import z from "zod";

export const createPersonalitySchema = z.object({
  userId: z.string(),
  personalityName: z.string(),
});

export const editPersonalitySchema = createPersonalitySchema;

export type TCreatePersonalitySchema = z.infer<typeof createPersonalitySchema>;

export type TEditPersonalitySchema = z.infer<typeof editPersonalitySchema>;
