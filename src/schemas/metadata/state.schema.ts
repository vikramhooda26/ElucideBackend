import z from "zod";

export const createStateSchema = z.object({
    userId: z.string(),
    stateName: z.string(),
});

export const editStateSchema = createStateSchema;

export type TCreateStateSchema = z.infer<typeof createStateSchema>;

export type TEditStateSchema = z.infer<typeof editStateSchema>;
