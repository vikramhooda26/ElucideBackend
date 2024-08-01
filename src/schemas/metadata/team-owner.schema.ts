import z from "zod";

export const createTeamOwnerSchema = z.object({
    userId: z.string(),
    teamOwnerName: z.string(),
});

export const editTeamOwnerSchema = createTeamOwnerSchema;

export type TCreateTeamOwnerSchema = z.infer<typeof createTeamOwnerSchema>;

export type TEditTeamOwnerSchema = z.infer<typeof editTeamOwnerSchema>;
