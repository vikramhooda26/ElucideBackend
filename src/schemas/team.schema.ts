import z from "zod";

export const createTeamSchema = z.object({
    teamName: z.string(),
    yearOfInception: z.string().optional(),
    sportId: z.number().optional(),
    leagueId: z.number().optional(),
    teamOwnerIds: z.number().array().optional(),
    franchiseFee: z.number().optional(),
    hqCityId: z.number().optional(),
});

export const editTeamSchema = createTeamSchema.partial();

export type TCreateTeamSchema = z.infer<typeof createTeamSchema>;
export type TEditTeamSchema = z.infer<typeof editTeamSchema>;
