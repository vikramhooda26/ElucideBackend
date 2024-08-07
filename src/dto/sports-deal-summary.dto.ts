import { Prisma } from "@prisma/client";
import { TSportsDealSummaryDetails } from "../types/sports-deal-summary.type.js";

export class SportsDealSummaryResponseDTO {
    id?: string;
    brandName?: string;
    partnerName?: string;
    type?: string;
    status?: string | null;
    level?: string;
    commencementDate?: string | null;
    expirationDate?: string | null;
    duration?: string | null;
    annualValue?: Prisma.Decimal | null;
    totalValue?: Prisma.Decimal | null;
    territory?: string;
    mediaLink?: string | null;
    assets?: string[];

    static toResponse(
        sportsDealSummaryDetails: TSportsDealSummaryDetails,
    ): SportsDealSummaryResponseDTO {
        const sportsDealSummaryDTO = new SportsDealSummaryResponseDTO();
        sportsDealSummaryDTO.id = sportsDealSummaryDetails.id.toString();
        sportsDealSummaryDTO.brandName =
            sportsDealSummaryDetails.dashapp_companydata?.company_name;
        sportsDealSummaryDTO.partnerName =
            sportsDealSummaryDetails.dashapp_leagueinfo?.property_name ||
            sportsDealSummaryDetails.dashapp_team?.team_name ||
            sportsDealSummaryDetails.dashapp_athlete?.athlete_name;
        sportsDealSummaryDTO.type = sportsDealSummaryDetails.type;
        sportsDealSummaryDTO.status = sportsDealSummaryDetails.status;
        sportsDealSummaryDTO.level =
            sportsDealSummaryDetails.dashapp_level?.name;
        sportsDealSummaryDTO.commencementDate =
            sportsDealSummaryDetails.commencement_date;
        sportsDealSummaryDTO.expirationDate =
            sportsDealSummaryDetails.expiration_date;
        sportsDealSummaryDTO.duration = sportsDealSummaryDetails.duration;
        sportsDealSummaryDTO.totalValue = sportsDealSummaryDetails.total_value;
        sportsDealSummaryDTO.annualValue =
            sportsDealSummaryDetails.annual_value;
        sportsDealSummaryDTO.territory =
            sportsDealSummaryDetails.dashapp_territory?.name;
        sportsDealSummaryDTO.mediaLink = sportsDealSummaryDetails.media_link;
        sportsDealSummaryDTO.assets =
            sportsDealSummaryDetails.dashapp_sportsdeal_assets.map(
                (asset) => asset.dashapp_assets.asset,
            );

        return sportsDealSummaryDTO;
    }
}
