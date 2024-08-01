import { Prisma } from "@prisma/client";

export const sportsDealSummarySelect =
    Prisma.validator<Prisma.dashapp_sportsdealsummarySelect>()({
        id: true,
        dashapp_companydata: { select: { company_name: true } },
        dashapp_leagueinfo: { select: { property_name: true } },
        dashapp_team: { select: { team_name: true } },
        dashapp_athlete: { select: { athlete_name: true } },
        dashapp_level: { select: { name: true } },
        dashapp_territory: { select: { name: true } },
        dashapp_sportsdeal_assets: {
            select: { dashapp_assets: { select: { asset: true } } },
        },
        type: true,
        status: true,
        commencement_date: true,
        expiration_date: true,
        duration: true,
        annual_value: true,
        total_value: true,
        media_link: true,
    });

export type TSportsDealSummaryDetails =
    Prisma.dashapp_sportsdealsummaryGetPayload<{
        select: typeof sportsDealSummarySelect;
    }>;
