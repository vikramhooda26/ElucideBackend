import z from "zod";

export const createTaglineSchema = z.object({
    userId: z.string(),
    taglineName: z.string(),
});

export const editTaglineSchema = createTaglineSchema;

export type TCreateTaglineSchema = z.infer<typeof createTaglineSchema>;

export type TEditTaglineSchema = z.infer<typeof editTaglineSchema>;
