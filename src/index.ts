import { Request, Response } from "express";
import { prisma } from "./db/index.js";
import { cookieParser, cors, dotenv, express } from "./imports/core.imports.js";
import { authMiddleware, globalErrorHandler } from "./imports/middleware.imports.js";
import * as Routers from "./imports/router.imports.js";
import { STATUS_CODE } from "./lib/constants.js";
import { InternalServerError } from "./lib/errors.js";
import { printLogs } from "./lib/log.js";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const authorizedHosts = process.env.AUTHORIZED_HOSTS ? process.env.AUTHORIZED_HOSTS.split(",") : [];

app.get("/main-categories", async (_req: Request, res: Response) => {
    try {
        const result = await prisma.dashapp_category.findMany({
            select: {
                id: true,
                category: true,
                dashapp_subcategory: {
                    select: {
                        id: true,
                        subcategory: true,
                        dashapp_companydata_subcategory: {
                            select: {
                                dashapp_companydata: {
                                    select: {
                                        id: true,
                                        company_name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        res.status(STATUS_CODE.OK).json(result);
    } catch (error) {
        printLogs("main-categories | ERROR", error);
        throw new InternalServerError("Something went wrong");
    }
});

app.use(
    cors({
        credentials: true,
        origin: authorizedHosts,
    }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin/chatbot", Routers.chatbotRouter);
app.use("/api/auth", Routers.authRouter);
app.use(authMiddleware);
app.use("/api/admin/user", Routers.userRouter);
app.use("/api/admin/athlete", Routers.athleteRouter);
app.use("/api/admin/league", Routers.leagueRouter);
app.use("/api/admin/team", Routers.teamRouter);
app.use("/api/admin/brand", Routers.brandRouter);
app.use("/api/admin/metadata", Routers.metadataRouter);
app.use("/api/admin/activation", Routers.activationRouter);
app.use("/api/admin/sports-deal-summary", Routers.sportsDealSummaryRouter);
app.use("/api/admin/age-range", Routers.ageRangeRouter);
app.use("/api/admin/association-level", Routers.associationLevel);
app.use("/api/admin/gender", Routers.genderRouter);
app.use("/api/admin/active-campaign", Routers.activeCampaignRouter);
app.use("/api/admin/personality", Routers.personalityRouter);
app.use("/api/admin/sub-personality", Routers.subpersonalityRouter);
app.use("/api/admin/agency", Routers.agencyRouter);
app.use("/api/admin/asset", Routers.assetRouter);
app.use("/api/admin/broadcast-partner", Routers.broadcastPartnerRouter);
app.use("/api/admin/city", Routers.cityRouter);
app.use("/api/admin/state", Routers.stateRouter);
app.use("/api/admin/category", Routers.categoryRouter);
app.use("/api/admin/subcategory", Routers.subcategoryRouter);
app.use("/api/admin/nccs", Routers.nccsRouter);
app.use("/api/admin/key-market", Routers.keyMarketRouter);
app.use("/api/admin/league-owner", Routers.leagueOwnerRouter);
app.use("/api/admin/level", Routers.levelRouter);
app.use("/api/admin/marketing-platform", Routers.marketingPlatformRouter);
app.use("/api/admin/ott-partner", Routers.ottPartnerRouter);
app.use("/api/admin/parent-org", Routers.parentOrgRouter);
app.use("/api/admin/sport", Routers.sportRouter);
app.use("/api/admin/tagline", Routers.taglineRouter);
app.use("/api/admin/team-owner", Routers.teamOwnerRouter);
app.use("/api/admin/territory", Routers.territoryRouter);
app.use("/api/admin/tier", Routers.tierRouter);
app.use("/api/admin/nationality", Routers.nationalityRouter);
app.use("/api/admin/social-media", Routers.socialMediaRouter);
app.use("/api/admin/filter", Routers.filterRouter);
app.use("/api/admin/athlete-status", Routers.athleteStatusRouter);
app.use("/api/admin/dashboard", Routers.dashboardRouter);

app.use(globalErrorHandler);

app.listen(port, () => console.log(`${new Date().toLocaleTimeString()} Listening on port ${port}`));
