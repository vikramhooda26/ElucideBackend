import z from "zod";

export const createSportSchema = z.object({
  userId: z.string(),
  sportName: z.string(),
});

export const editSportSchema = createSportSchema;

export type TCreateSportSchema = z.infer<typeof createSportSchema>;

export type TEditSportSchema = z.infer<typeof editSportSchema>;
