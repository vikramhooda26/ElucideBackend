import z from "zod";

export const createAssetSchema = z.object({
  assetName: z.string(),
  userId: z.string(),
});

export const editAssetSchema = createAssetSchema;

export type TCreateAssetSchema = z.infer<typeof createAssetSchema>;
export type TEditAssetSchema = z.infer<typeof editAssetSchema>;
