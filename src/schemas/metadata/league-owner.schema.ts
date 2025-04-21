import z from "zod";

export const createLeagueOwnerSchema = z.object({
  userId: z.string(),
  leagueOwnerName: z.string(),
});

export const editLeagueOwnerSchema = createLeagueOwnerSchema;

export type TCreateLeagueOwnerSchema = z.infer<typeof createLeagueOwnerSchema>;

export type TEditLeagueOwnerSchema = z.infer<typeof editLeagueOwnerSchema>;
