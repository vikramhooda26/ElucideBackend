import asyncHandler from "express-async-handler";
import { prisma } from "../../db/index.js";
import { METADATA_KEYS, STATUS_CODE } from "../../lib/constants.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import {
    TCreateStateSchema,
    TEditStateSchema,
} from "../../schemas/metadata/state.schema.js";
import { metadataStore } from "../../managers/MetadataManager.js";

export const getAllStates = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const states = await prisma.dashapp_states.findMany({
        select: {
            id: true,
            state: true,
            created_date: true,
            modified_date: true,
            created_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            modified_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            _count: true,
        },
        orderBy: { modified_date: "desc" },
        take: Number.isNaN(Number(take)) ? undefined : Number(take),
        skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
    });

    if (states.length < 1) {
        throw new NotFoundError("States data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        states.map((state) => ({
            stateId: state.id,
            stateName: state.state,
            createdDate: state.created_date,
            modifiedDate: state.modified_date,
            createdBy: {
                userId: state.created_by?.id,
                email: state.created_by?.email,
            },
            modifiedBy: {
                userId: state.modified_by?.id,
                email: state.modified_by?.email,
            },
            count: state._count,
        })),
    );
});

export const getStateById = asyncHandler(async (req, res) => {
    const stateId = req.params.id;

    if (!stateId) {
        throw new BadRequestError("State ID not found");
    }

    const state = await prisma.dashapp_states.findUnique({
        where: { id: BigInt(stateId) },
        select: {
            id: true,
            state: true,
        },
    });

    if (!state) {
        throw new NotFoundError("This state does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        stateId: state.id,
        stateName: state.state,
    });
});

export const createState = asyncHandler(async (req, res) => {
    const { stateName, userId } = req.validatedData as TCreateStateSchema;

    await prisma.dashapp_states.create({
        data: {
            state: stateName,
            created_by: { connect: { id: BigInt(userId) } },
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.STATE, true);

    res.status(STATUS_CODE.OK).json({
        message: "State created",
    });
});

export const editState = asyncHandler(async (req, res) => {
    const stateId = req.params.id;

    if (!stateId) {
        throw new BadRequestError("State ID not found");
    }

    const stateExists = await prisma.dashapp_states.findUnique({
        where: { id: BigInt(stateId) },
        select: { id: true },
    });

    if (!stateExists) {
        throw new NotFoundError("This state does not exists");
    }

    const { stateName, userId } = req.validatedData as TEditStateSchema;

    await prisma.dashapp_states.update({
        where: { id: BigInt(stateId) },
        data: {
            state: stateName,
            modified_by: { connect: { id: BigInt(userId) } },
        },
        select: {
            id: true,
        },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.STATE, true);

    res.status(STATUS_CODE.OK).json({
        message: "State updated",
    });
});

export const deleteState = asyncHandler(async (req, res) => {
    const stateId = req.params.id;

    if (!stateId) {
        throw new BadRequestError("State ID not found");
    }

    const stateExists = await prisma.dashapp_states.findUnique({
        where: { id: BigInt(stateId) },
        select: { id: true },
    });

    if (!stateExists) {
        throw new NotFoundError("This state does not exists");
    }

    await prisma.dashapp_states.delete({
        where: { id: BigInt(stateId) },
        select: { id: true },
    });

    metadataStore.setHasUpdated(METADATA_KEYS.STATE, true);

    res.status(STATUS_CODE.OK).json({
        message: "State deleted",
    });
});
