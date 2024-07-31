import z from "zod";

export const createActiveCampaignSchema = z.object({
    activeCampaignName: z.string(),
    userId: z.string(),
});

export const editActiveCampaignSchema = createActiveCampaignSchema;

export type TCreateActiveCampaignSchema = z.infer<
    typeof createActiveCampaignSchema
>;

export type TEditActiveCampaignSchema = z.infer<
    typeof editActiveCampaignSchema
>;
