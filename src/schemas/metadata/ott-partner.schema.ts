import z from "zod";

export const createOttPartnerSchema = z.object({
    userId: z.string(),
    ottPartnerName: z.string(),
});

export const editOttPartnerSchema = createOttPartnerSchema;

export type TCreateOttPartnerSchema = z.infer<typeof createOttPartnerSchema>;

export type TEditOttPartnerSchema = z.infer<typeof editOttPartnerSchema>;
