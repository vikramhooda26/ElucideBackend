import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { STATUS_CODE } from "../../lib/constants.js";

const getDatabase = asyncHandler(async (req, res) => {
    // const token = req.query.token;

    // if (!token) {
    //     throw new BadRequestError("Token not found");
    // }

    const athletes = await prisma.dashapp_athlete.findMany({});
    const team = await prisma.dashapp_team.findMany({});
    const brand = await prisma.dashapp_companydata.findMany({});
    const league = await prisma.dashapp_league.findMany({});
    const sportsDealSummary = await prisma.dashapp_sportsdealsummary.findMany({});
    const activationSummary = await prisma.dashapp_activation.findMany({});

    res.status(STATUS_CODE.OK).json({
        data: {
            athletes,
            team,
            brand,
            league,
            sportsDealSummary,
            activationSummary,
        },
    });
});

export { getDatabase };
