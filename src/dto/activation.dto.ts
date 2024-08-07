import { TActivationDetails } from "../types/activation.type.js";

export class ActivationResponseDTO {
    id?: string;
    name?: string | null;
    type?: string[];
    asset?: string[];
    year?: string | null;
    teamName?: string;
    athleteName?: string;
    leagueName?: string;
    brandName?: string;

    static toResponse(
        activationDetails: TActivationDetails,
    ): ActivationResponseDTO {
        const activationDTO = new ActivationResponseDTO();
        activationDTO.id = activationDetails.id.toString();
        activationDTO.name = activationDetails.name;
        activationDTO.type = activationDetails.dashapp_activation_type.map(
            (type) => type.dashapp_marketingplatform.platform,
        );
        activationDTO.asset = activationDetails.dashapp_activation_assets.map(
            (asset) => asset.dashapp_assets.asset,
        );
        activationDTO.year = activationDetails.Year;
        activationDTO.athleteName =
            activationDetails.dashapp_athlete?.athlete_name;
        activationDTO.teamName = activationDetails.dashapp_team?.team_name;
        activationDTO.leagueName =
            activationDetails.dashapp_leagueinfo?.property_name;
        activationDTO.brandName =
            activationDetails.dashapp_companydata?.company_name;

        return activationDTO;
    }
}
