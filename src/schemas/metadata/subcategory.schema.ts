import z from "zod";

export const createSubcategorySchema = z.object({
  userId: z.string(),
  categoryId: z.string(),
  subcategoryName: z.string(),
});

export const editSubcategorySchema = createSubcategorySchema;

export type TCreateSubcategorySchema = z.infer<typeof createSubcategorySchema>;

export type TEditSubcategorySchema = z.infer<typeof editSubcategorySchema>;
