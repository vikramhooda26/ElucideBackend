import { Prisma } from "@prisma/client";

export const activationSelect =
    Prisma.validator<Prisma.dashapp_activationSelect>()({
        id: true,
        name: true,
        dashapp_activation_type: {
            select: {
                dashapp_marketingplatform: { select: { platform: true } },
            },
        },
        dashapp_activation_market: {
            select: { dashapp_states: { select: { state: true } } },
        },
        dashapp_activation_assets: {
            select: { dashapp_assets: { select: { asset: true } } },
        },
        Year: true,
        dashapp_companydata: { select: { company_name: true } },
        dashapp_leagueinfo: { select: { property_name: true } },
        dashapp_team: { select: { team_name: true } },
        dashapp_athlete: { select: { athlete_name: true } },
    });

export type TActivationDetails = Prisma.dashapp_activationGetPayload<{
    select: typeof activationSelect;
}>;
