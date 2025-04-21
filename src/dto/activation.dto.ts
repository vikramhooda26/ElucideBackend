import { TActivationDetails } from "../types/activation.type.js";

export class ActivationResponseDTO {
  id?: string;
  name?: string | null;
  type?: {
    id?: string;
    name?: string;
  }[];
  asset?: {
    id?: string;
    name?: string;
  }[];
  marketIds?: {
    id?: string;
    name?: string;
  }[];
  year?: string | null;
  team?: {
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
  brand?: {
    id?: string;
    name?: string;
  };

  static toResponse(activationDetails: TActivationDetails): ActivationResponseDTO {
    const activationDTO = new ActivationResponseDTO();
    activationDTO.id = activationDetails.id.toString();
    activationDTO.name = activationDetails.name;
    activationDTO.type = activationDetails.dashapp_activation_type.map((type) => ({
      id: type.dashapp_marketingplatform.id.toString(),
      name: type.dashapp_marketingplatform.platform,
    }));
    activationDTO.asset = activationDetails.dashapp_activation_assets.map((asset) => ({
      id: asset.dashapp_assets.id.toString(),
      name: asset.dashapp_assets.asset,
    }));
    activationDTO.year = activationDetails.Year;
    activationDTO.athlete = {
      id: activationDetails.dashapp_athlete?.id.toString(),
      name: activationDetails.dashapp_athlete?.athlete_name,
    };
    activationDTO.team = {
      id: activationDetails.dashapp_team?.id.toString(),
      name: activationDetails.dashapp_team?.team_name,
    };
    activationDTO.league = {
      id: activationDetails.dashapp_leagueinfo?.id.toString(),
      name: activationDetails.dashapp_leagueinfo?.property_name,
    };
    activationDTO.brand = {
      id: activationDetails.dashapp_companydata?.id.toString(),
      name: activationDetails.dashapp_companydata?.company_name,
    };
    activationDTO.marketIds = activationDetails.dashapp_activation_market.map((market) => ({
      id: market.dashapp_states.id.toString(),
      name: market.dashapp_states.state,
    }));

    return activationDTO;
  }
}
