import z from "zod";

export const createAssociationLevelSchema = z.object({
    userId: z.string(),
    associationLevelName: z.string(),
});

export const editAssociationLevelSchema = createAssociationLevelSchema;

export type TCreateAssociationLevelSchema = z.infer<typeof createAssociationLevelSchema>;

export type TEditAssociationLevelSchema = z.infer<typeof editAssociationLevelSchema>;
