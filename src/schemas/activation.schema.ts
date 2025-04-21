import z from "zod";

export const createActivationSchema = z.object({
  userId: z.string(),
  name: z.string(),
  leagueId: z.string().optional(),
  teamId: z.string().optional(),
  athleteId: z.string().optional(),
  brandId: z.string(),
  typeIds: z.string().array().optional(),
  marketIds: z.string().array().optional(),
  assetIds: z.string().array().optional(),
  year: z.string().optional(),
});

export const editActivationSchema = createActivationSchema.partial();

export type TCreateActivationSchema = z.infer<typeof createActivationSchema>;

export type TEditActivationSchema = z.infer<typeof editActivationSchema>;
