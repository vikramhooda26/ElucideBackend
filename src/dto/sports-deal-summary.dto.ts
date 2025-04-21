import { TSportsDealSummaryDetails } from "../types/sports-deal-summary.type.js";

export class SportsDealSummaryResponseDTO {
  id?: string;
  brand?: {
    id?: string;
    name?: string;
  };
  athlete?: {
    id?: string;
    name?: string;
  };
  league?: {
    id?: string;
    name?: string;
  };
  team?: {
    id?: string;
    name?: string;
  };
  type?: string;
  status?: string | null;
  level?: {
    id?: string;
    name?: string;
  };
  commencementDate?: string | null;
  expirationDate?: string | null;
  duration?: string | null;
  annualValue?: string;
  totalValue?: string;
  territory?: {
    id?: string;
    name?: string;
  };
  mediaLink?: string | null;
  assets?: {
    id?: string;
    name?: string;
  }[];

  static toResponse(sportsDealSummaryDetails: TSportsDealSummaryDetails): SportsDealSummaryResponseDTO {
    const sportsDealSummaryDTO = new SportsDealSummaryResponseDTO();
    sportsDealSummaryDTO.id = sportsDealSummaryDetails.id.toString();
    sportsDealSummaryDTO.brand = {
      id: sportsDealSummaryDetails.dashapp_companydata?.id.toString(),
      name: sportsDealSummaryDetails.dashapp_companydata?.company_name,
    };
    sportsDealSummaryDTO.athlete = {
      id: sportsDealSummaryDetails.dashapp_athlete?.id.toString(),
      name: sportsDealSummaryDetails.dashapp_athlete?.athlete_name,
    };
    (sportsDealSummaryDTO.team = {
      id: sportsDealSummaryDetails.dashapp_team?.id.toString(),
      name: sportsDealSummaryDetails.dashapp_team?.team_name,
    }),
      (sportsDealSummaryDTO.league = {
        id: sportsDealSummaryDetails.dashapp_leagueinfo?.id.toString(),
        name: sportsDealSummaryDetails.dashapp_leagueinfo?.property_name,
      }),
      (sportsDealSummaryDTO.type = sportsDealSummaryDetails.type);
    sportsDealSummaryDTO.status = sportsDealSummaryDetails.status;
    sportsDealSummaryDTO.level = {
      id: sportsDealSummaryDetails.dashapp_level?.id.toString(),
      name: sportsDealSummaryDetails.dashapp_level?.name,
    };
    sportsDealSummaryDTO.commencementDate = sportsDealSummaryDetails.commencement_date;
    sportsDealSummaryDTO.expirationDate = sportsDealSummaryDetails.expiration_date;
    sportsDealSummaryDTO.duration = sportsDealSummaryDetails.duration;
    sportsDealSummaryDTO.totalValue = sportsDealSummaryDetails.total_value?.toString();
    sportsDealSummaryDTO.annualValue = sportsDealSummaryDetails.annual_value?.toString();
    sportsDealSummaryDTO.territory = {
      id: sportsDealSummaryDetails.dashapp_territory?.id.toString(),
      name: sportsDealSummaryDetails.dashapp_territory?.name,
    };
    sportsDealSummaryDTO.mediaLink = sportsDealSummaryDetails.media_link;
    sportsDealSummaryDTO.assets = sportsDealSummaryDetails.dashapp_sportsdeal_assets.map((asset) => ({
      id: asset.dashapp_assets.id.toString(),
      name: asset.dashapp_assets.asset,
    }));

    return sportsDealSummaryDTO;
  }
}
