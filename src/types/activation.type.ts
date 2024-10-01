import { Prisma } from "@prisma/client";

export const activationSelect = Prisma.validator<Prisma.dashapp_activationSelect>()({
    id: true,
    name: true,
    dashapp_activation_type: {
        select: {
            dashapp_marketingplatform: {
                select: { id: true, platform: true },
            },
        },
    },
    dashapp_activation_market: {
        select: { dashapp_states: { select: { id: true, state: true } } },
    },
    dashapp_activation_assets: {
        select: { dashapp_assets: { select: { id: true, asset: true } } },
    },
    Year: true,
    dashapp_companydata: { select: { id: true, company_name: true } },
    dashapp_leagueinfo: { select: { id: true, property_name: true } },
    dashapp_team: { select: { id: true, team_name: true } },
    dashapp_athlete: { select: { id: true, athlete_name: true } },
});

export type TActivationDetails = Prisma.dashapp_activationGetPayload<{
    select: typeof activationSelect;
}>;
