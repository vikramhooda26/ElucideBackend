import z from "zod";

export const createSportsDealSummarySchema = z.object({
    type: z.string(),
    status: z.string().optional(),
    levelId: z.string().optional(),
    commencementYear: z.string().optional(),
    expirationDate: z.string().optional(),
    duration: z.string().optional(),
    annualValue: z.number().optional(),
    totalValue: z.number().optional(),
    territoryId: z.string().optional(),
    mediaLink: z.string().optional(),
    assetIds: z.string().array().optional(),
    brandId: z.string(),
    leagueId: z.string().optional(),
    teamId: z.string().optional(),
    athleteId: z.string().optional(),
    userId: z.string(),
});

export const editSportsDealSummarySchema =
    createSportsDealSummarySchema.partial();

export type TCreateSportsDealSummarySchema = z.infer<
    typeof createSportsDealSummarySchema
>;

export type TEditSportsDealSummarySchema = z.infer<
    typeof editSportsDealSummarySchema
>;
