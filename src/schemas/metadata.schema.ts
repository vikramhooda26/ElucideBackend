import z from "zod";

export const getAllMetadataSchema = z.object({
    age: z.boolean().optional(),
    gender: z.boolean().optional(),
    personalityTrait: z.boolean().optional(),
    state: z.boolean().optional(),
    city: z.boolean().optional(),
    category: z.boolean().optional(),
    parentOrg: z.boolean().optional(),
    agency: z.boolean().optional(),
    tagline: z.boolean().optional(),
    activeCampaign: z.boolean().optional(),
    marketingPlatform: z.boolean().optional(),
    nccs: z.boolean().optional(),
    keyMarkets: z.boolean().optional(),
    // current tertiary is mapped to states, ask the client if that's correct or if that needs to be mapped to keyMarkets
    tertiary: z.boolean().optional(),
    league: z.boolean().optional(),
    teamOwner: z.boolean().optional(),
    leagueOwner: z.boolean().optional(),
    format: z.boolean().optional(),
    broadcastPartner: z.boolean().optional(),
    ottPartner: z.boolean().optional(),
    sportsDealSummaryType: z.boolean().optional(),
    sportsDealSummaryLevel: z.boolean().optional(),
    sportsDealSummaryStatus: z.boolean().optional(),
    sportsDealSummaryTerritory: z.boolean().optional(),
    asset: z.boolean().optional(),
});

export type TGetAllMetadataSchema = z.infer<typeof getAllMetadataSchema>;
