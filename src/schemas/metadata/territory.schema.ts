import z from "zod";

export const createTerritorySchema = z.object({
    userId: z.string(),
    territoryName: z.string(),
});

export const editTerritorySchema = createTerritorySchema;

export type TCreateTerritorySchema = z.infer<typeof createTerritorySchema>;

export type TEditTerritorySchema = z.infer<typeof editTerritorySchema>;
