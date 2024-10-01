import z from "zod";

export const createBroadcastPartnerSchema = z.object({
    broadcastPartnerName: z.string(),
    userId: z.string(),
});

export const editBroadcastPartnerSchema = createBroadcastPartnerSchema;

export type TCreateBroadcastPartnerSchema = z.infer<typeof createBroadcastPartnerSchema>;

export type TEditBroadcastPartnerSchema = z.infer<typeof editBroadcastPartnerSchema>;
