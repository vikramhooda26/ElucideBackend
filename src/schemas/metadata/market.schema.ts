import z from "zod";

export const createkeyMarketchema = z.object({
    userId: z.string(),
    keyMarketName: z.string(),
});

export const editKeyMarketSchema = createkeyMarketchema;

export type TCreateKeyMarketSchema = z.infer<typeof createkeyMarketchema>;

export type TEditKeyMarketSchema = z.infer<typeof editKeyMarketSchema>;
