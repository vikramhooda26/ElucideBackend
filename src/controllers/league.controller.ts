import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { prisma } from "../db/index.js";
import { STATUS_CODE } from "../lib/constants.js";

export const getLeagueById = asyncHandler(async (req, res) => {
    const leagueId = req.params.id;

    if (!leagueId) {
        throw new BadRequestError("League ID not found");
    }

    const league = await prisma.dashapp_leagueinfo.findUnique({
        where: { id: Number(leagueId) },
    });

    if (!league) {
        throw new NotFoundError();
    }

    res.status(STATUS_CODE.OK).json(league);
});
