import z from "zod";

export const createTierSchema = z.object({
  userId: z.string(),
  tierName: z.string(),
});

export const editTierSchema = createTierSchema;

export type TCreateTierSchema = z.infer<typeof createTierSchema>;

export type TEditTierSchema = z.infer<typeof editTierSchema>;
