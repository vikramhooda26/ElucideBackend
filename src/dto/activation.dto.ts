import { TActivationDetails } from "../types/activation.type.js";

export class ActivationResponseDTO {
    activationId?: bigint;
    activationName?: string | null;
    type?: string[];
    asset?: string[];
    year?: string | null;
    partner?: string;
    brand?: string;

    static toResponse(
        activationDetails: TActivationDetails,
    ): ActivationResponseDTO {
        const activationDTO = new ActivationResponseDTO();
        activationDTO.activationId = activationDetails.id;
        activationDTO.activationName = activationDetails.name;
        activationDTO.type = activationDetails.dashapp_activation_type.map(
            (type) => type.dashapp_marketingplatform.platform,
        );
        activationDTO.asset = activationDetails.dashapp_activation_assets.map(
            (asset) => asset.dashapp_assets.asset,
        );
        activationDTO.year = activationDetails.Year;
        activationDTO.partner =
            activationDetails.dashapp_athlete?.athlete_name ||
            activationDetails.dashapp_leagueinfo?.property_name ||
            activationDetails.dashapp_team?.team_name;
        activationDTO.brand =
            activationDetails.dashapp_companydata?.company_name;

        return activationDTO;
    }
}
