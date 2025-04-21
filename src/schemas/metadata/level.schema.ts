import z from "zod";

export const createLevelSchema = z.object({
  userId: z.string(),
  levelName: z.string(),
});

export const editLevelSchema = createLevelSchema;

export type TCreateLevelSchema = z.infer<typeof createLevelSchema>;

export type TEditLevelSchema = z.infer<typeof editLevelSchema>;
