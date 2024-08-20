// Auth Routers
import { authRouter } from "../routes/auth.router.js";
import { activationRouter } from "../routes/activation.router.js";

// Admin Routers
import { athleteRouter } from "../routes/athlete.router.js";
import { brandRouter } from "../routes/brand.router.js";
import { leagueRouter } from "../routes/league.router.js";
import { teamRouter } from "../routes/team.router.js";
import { sportsDealSummaryRouter } from "../routes/sports-deal-summary.router.js";
import { filterRouter } from "../routes/filter.router.js";

// Metadata Routers
import { metadataRouter } from "../routes/metadata/metadata.router.js";
import { ageRangeRouter } from "../routes/metadata/age.router.js";
import { agencyRouter } from "../routes/metadata/agency.router.js";
import { assetRouter } from "../routes/metadata/asset.router.js";
import { broadcastPartnerRouter } from "../routes/metadata/broadcast.router.js";
import { activeCampaignRouter } from "../routes/metadata/campaign.router.js";
import { categoryRouter } from "../routes/metadata/category.router.js";
import { cityRouter } from "../routes/metadata/city.router.js";
import { genderRouter } from "../routes/metadata/gender.router.js";
import { leagueOwnerRouter } from "../routes/metadata/league-owner.router.js";
import { levelRouter } from "../routes/metadata/level.router.js";
import { keyMarketRouter } from "../routes/metadata/market.router.js";
import { marketingPlatformRouter } from "../routes/metadata/marketing-platform.router.js";
import { nccsRouter } from "../routes/metadata/nccs.router.js";
import { ottPartnerRouter } from "../routes/metadata/ott-partner.router.js";
import { parentOrgRouter } from "../routes/metadata/parent-org.router.js";
import { personalityRouter } from "../routes/metadata/personality.router.js";
import { sportRouter } from "../routes/metadata/sport.router.js";
import { stateRouter } from "../routes/metadata/state.router.js";
import { subcategoryRouter } from "../routes/metadata/subcategory.router.js";
import { subpersonalityRouter } from "../routes/metadata/subpersonality.router.js";
import { taglineRouter } from "../routes/metadata/tagline.router.js";
import { teamOwnerRouter } from "../routes/metadata/team-owner.router.js";
import { territoryRouter } from "../routes/metadata/territory.router.js";
import { tierRouter } from "../routes/metadata/tier.router.js";
import { athleteStatusRouter } from "../routes/metadata/athlete-status.router.js";
import { associationLevel } from "../routes/metadata/association-level.router.js";
import { nationalityRouter } from "../routes/metadata/nationality.router.js";
import { socialMediaRouter } from "../routes/metadata/social-media.router.js";

// Dashboard Routers
import { dashboardRouter } from "../routes/dashboard.router.js";

export {
    authRouter,
    activationRouter,
    athleteRouter,
    brandRouter,
    leagueRouter,
    teamRouter,
    sportsDealSummaryRouter,
    filterRouter,
    metadataRouter,
    ageRangeRouter,
    agencyRouter,
    assetRouter,
    broadcastPartnerRouter,
    activeCampaignRouter,
    categoryRouter,
    cityRouter,
    genderRouter,
    leagueOwnerRouter,
    levelRouter,
    keyMarketRouter,
    marketingPlatformRouter,
    nccsRouter,
    ottPartnerRouter,
    parentOrgRouter,
    personalityRouter,
    sportRouter,
    stateRouter,
    subcategoryRouter,
    subpersonalityRouter,
    taglineRouter,
    teamOwnerRouter,
    territoryRouter,
    tierRouter,
    athleteStatusRouter,
    associationLevel,
    nationalityRouter,
    socialMediaRouter,
    dashboardRouter,
};
