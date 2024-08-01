import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.router.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { athleteRouter } from "./routes/athlete.router.js";
import { leagueRouter } from "./routes/league.router.js";
import { teamRouter } from "./routes/team.router.js";
import { brandRouter } from "./routes/brand.router.js";
import { metadataRouter } from "./routes/metadata/metadata.router.js";
import { activeCampaignRouter } from "./routes/metadata/campaign.router.js";
import { agencyRouter } from "./routes/metadata/agency.router.js";
import { ageRangeRouter } from "./routes/metadata/age.router.js";
import { assetRouter } from "./routes/metadata/asset.router.js";
import { broadcastPartnerRouter } from "./routes/metadata/broadcast.router.js";
import { categoryRouter } from "./routes/metadata/category.router.js";
import { subcategoryRouter } from "./routes/metadata/subcategory.router.js";
import { genderRouter } from "./routes/metadata/gender.router.js";
import { cityRouter } from "./routes/metadata/city.router.js";
import { stateRouter } from "./routes/metadata/state.router.js";
import { nccsRouter } from "./routes/metadata/nccs.router.js";
import { keyMarketRouter } from "./routes/metadata/market.router.js";
import { leagueOwnerRouter } from "./routes/metadata/league-owner.router.js";
import { levelRouter } from "./routes/metadata/level.router.js";
import { personalityRouter } from "./routes/metadata/persoanlity.router.js";
import { subpersonalityRouter } from "./routes/metadata/subpersonality.router.js";
import { marketingPlatformRouter } from "./routes/metadata/marketing-platform.router.js";
import { ottPartnerRouter } from "./routes/metadata/ott-partner.router.js";
import { parentOrgRouter } from "./routes/metadata/parent-org.router.js";
import { sportRouter } from "./routes/metadata/sport.router.js";
import { taglineRouter } from "./routes/metadata/tagline.router.js";
import { teamOwnerRouter } from "./routes/metadata/team-owner.router.js";
import { territoryRouter } from "./routes/metadata/territory.router.js";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const authorizedHosts = process.env.AUTHORIZED_HOSTS
    ? process.env.AUTHORIZED_HOSTS.split(",")
    : [];

app.use(
    cors({
        credentials: true,
        origin: authorizedHosts,
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use(authMiddleware);
app.use("/api/admin/athlete", athleteRouter);
app.use("/api/admin/league", leagueRouter);
app.use("/api/admin/team", teamRouter);
app.use("/api/admin/brand", brandRouter);
app.use("/api/admin/metadata", metadataRouter);
app.use("/api/admin/active-campaign", activeCampaignRouter);
app.use("/api/admin/agency", agencyRouter);
app.use("/api/admin/age-range", ageRangeRouter);
app.use("/api/admin/asset", assetRouter);
app.use("/api/admin/broadcast-partner", broadcastPartnerRouter);
app.use("/api/admin/category", categoryRouter);
app.use("/api/admin/subcategory", subcategoryRouter);
app.use("/api/admin/gender", genderRouter);
app.use("/api/admin/city", cityRouter);
app.use("/api/admin/state", stateRouter);
app.use("/api/admin/nccs", nccsRouter);
app.use("/api/admin/key-market", keyMarketRouter);
app.use("/api/admin/league-owner", leagueOwnerRouter);
app.use("/api/admin/level", levelRouter);
app.use("/api/admin/personality", personalityRouter);
app.use("/api/admin/subpersonality", subpersonalityRouter);
app.use("/api/admin/marketing-platform", marketingPlatformRouter);
app.use("/api/admin/ott-partner", ottPartnerRouter);
app.use("/api/admin/parent-org", parentOrgRouter);
app.use("/api/admin/sport", sportRouter);
app.use("/api/admin/tagline", taglineRouter);
app.use("/api/admin/team-owner", teamOwnerRouter);
app.use("/api/admin/territory", territoryRouter);

app.use(globalErrorHandler);

app.listen(port, () =>
    console.log(`${new Date().toLocaleTimeString()} Listening on port ${port}`),
);

/**
 * @todo
 * Ensure that the database is working properly after the changes made to the dashapp_income table
 * Finish the entire backend at any cost on thursday because the frontend needs me ASAP
 */
