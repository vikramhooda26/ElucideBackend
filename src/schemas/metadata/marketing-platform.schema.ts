import z from "zod";

export const createMarkingPlatformSchema = z.object({
    userId: z.string(),
    marketingPlatformName: z.string(),
});

export const editMarkingPlatformSchema = createMarkingPlatformSchema;

export type TCreateMarketingPlatformSchema = z.infer<typeof createMarkingPlatformSchema>;

export type TEditMarketingPlatformSchema = z.infer<typeof editMarkingPlatformSchema>;
