import z from "zod";

export const createSocialMediaSchema = z.object({
  userId: z.string(),
  socialMedia: z.string(),
});

export const editSocialMediaSchema = createSocialMediaSchema;

export type TCreateSocialMediaSchema = z.infer<typeof createSocialMediaSchema>;

export type TEditSocialMediaSchema = z.infer<typeof editSocialMediaSchema>;
