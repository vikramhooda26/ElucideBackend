import z from "zod";

export const filteredStakeholdersSchema = z.object({});

export type TFilteredStakeholdersSchema = z.infer<typeof filteredStakeholdersSchema>;
