import z from "zod";

export const createParentOrgSchema = z.object({
    userId: z.string(),
    parentOrgName: z.string(),
});

export const editParentOrgSchema = createParentOrgSchema;

export type TCreateParentOrgSchema = z.infer<typeof createParentOrgSchema>;

export type TEditParentOrgSchema = z.infer<typeof editParentOrgSchema>;
