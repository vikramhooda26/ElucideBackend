import z from "zod";

export const createCategorySchema = z.object({
  userId: z.string(),
  categoryName: z.string(),
});

export const editCategorySchema = createCategorySchema;

export type TCreateCategorySchema = z.infer<typeof createCategorySchema>;

export type TEditCategorySchema = z.infer<typeof editCategorySchema>;
