import asyncHandler from "express-async-handler";

export const getFilteredStakeholders = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const {} = req.validatedData;
});
