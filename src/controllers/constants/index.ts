import { Prisma } from "@prisma/client";
import z from "zod";
import { prisma } from "../../db/index.js";
import { NotFoundError } from "../../lib/errors.js";
import { filteredAthleteSchema } from "../../schemas/athlete.schema.js";
import { filteredLeagueSchema } from "../../schemas/league.schema.js";
import { printLogs } from "../../lib/log.js";
import { athleteSelect } from "../../types/athlete.type.js";

export const getGenderQuery = async (genderIds: string[]) => {
    const length = genderIds.length;

    if (length === 0) {
        return undefined;
    }

    let query: { [key: string]: any } | undefined;

    const genders = await prisma.dashapp_gender.findMany({ select: { id: true } });

    if (!genders.length) {
        return undefined;
    }

    if (length === 1) {
        const genderId = genderIds[0];
        const genderInDatabase = genders.find((value) => value.id.toString() === genderId);

        if (!genderInDatabase?.id) {
            throw new NotFoundError("This gender ID does not exist");
        }

        const notIn = genders.filter((gender) => gender.id !== genderInDatabase.id).map((gender) => gender.id);

        printLogs("notIn", notIn);
        printLogs("genderInDatabase", genderInDatabase?.id);

        if (genderInDatabase?.id) {
            query = {
                AND: [
                    {
                        id: genderInDatabase.id,
                    },
                    {
                        id: { notIn },
                    },
                ],
            };
        }
    }

    if (length === 2) {
        query = {
            OR: genderIds.map((id) => ({
                id: BigInt(id),
            })),
        };
    }

    printLogs("Gender query", query);

    return query;
};

export const getCostQuery = (costOfAssociation: z.infer<typeof filteredAthleteSchema>["costOfAssociation"]) => {
    let query;
    if (costOfAssociation?.cost?.length === 2) {
        if (costOfAssociation.operationType === "in") {
            query = {
                gte: new Prisma.Decimal(costOfAssociation.cost[0]),
                lte: new Prisma.Decimal(costOfAssociation.cost[1]),
            };
        }
    } else if (costOfAssociation?.cost?.length === 1) {
        if (costOfAssociation.operationType === "gte") {
            query = {
                gte: new Prisma.Decimal(costOfAssociation.cost[0]),
            };
        } else if (costOfAssociation.operationType === "lte") {
            query = {
                lte: new Prisma.Decimal(costOfAssociation.cost[0]),
            };
        } else if (costOfAssociation.operationType === "equals") {
            query = {
                equals: new Prisma.Decimal(costOfAssociation.cost[0]),
            };
        }
    }
    return query;
};

export const getEndorsementQuery = (endorsement: z.infer<typeof filteredLeagueSchema>["endorsement"]) => {
    const query: any = {
        name: endorsement?.name ? { contains: endorsement.name, mode: "insensitive" } : undefined,
        active: endorsement?.isActive !== undefined ? endorsement.isActive : undefined,
    };

    return query;
};

type TReachMetrics = z.infer<typeof filteredLeagueSchema>["reachMetrics"];

type TViewershipMetrics = z.infer<typeof filteredLeagueSchema>["viewershipMetrics"];

type TYearMetrics = z.infer<typeof filteredLeagueSchema>["yearMetrics"];

type TPartnerIdMetrics = z.infer<typeof filteredLeagueSchema>["partnerIdMetrics"];

export const getMetricsQuery = (
    partnerType: "broadcast" | "ott",
    reachMetrics: TReachMetrics,
    viewershipMetrics: TViewershipMetrics,
    yearMetrics: TYearMetrics,
    partnerIdMetrics: TPartnerIdMetrics,
) => {
    let query;

    query = {
        reach:
            reachMetrics?.partnerType === partnerType && reachMetrics?.reach?.length
                ? reachMetrics?.reach?.length === 1
                    ? {
                          ...(reachMetrics.operationType === "lte" && {
                              lte: reachMetrics.reach[0],
                          }),
                          ...(reachMetrics.operationType === "gte" && {
                              gte: reachMetrics.reach[0],
                          }),
                          ...(reachMetrics.operationType === "equals" && {
                              equals: reachMetrics.reach[0],
                          }),
                      }
                    : reachMetrics?.reach?.length === 2
                      ? {
                            ...(reachMetrics?.operationType === "in" && {
                                gte: reachMetrics.reach[0],
                                lte: reachMetrics.reach[1],
                            }),
                        }
                      : undefined
                : undefined,
        viewership:
            viewershipMetrics?.partnerType === partnerType && viewershipMetrics?.viewership?.length
                ? viewershipMetrics?.viewership?.length === 1
                    ? {
                          ...(viewershipMetrics.operationType === "lte" && {
                              lte: viewershipMetrics.viewership[0],
                          }),
                          ...(viewershipMetrics.operationType === "gte" && {
                              gte: viewershipMetrics.viewership[0],
                          }),
                          ...(viewershipMetrics.operationType === "equals" && {
                              equals: viewershipMetrics.viewership[0],
                          }),
                      }
                    : viewershipMetrics?.viewership?.length === 2 && viewershipMetrics?.operationType === "in"
                      ? {
                            gte: viewershipMetrics.viewership[0],
                            lte: viewershipMetrics.viewership[1],
                        }
                      : undefined
                : undefined,
        year:
            yearMetrics?.partnerType === partnerType && yearMetrics?.year?.length
                ? yearMetrics?.year?.length === 1
                    ? {
                          ...(yearMetrics.operationType === "lte" && {
                              lte: yearMetrics.year[0],
                          }),
                          ...(yearMetrics.operationType === "gte" && {
                              gte: yearMetrics.year[0],
                          }),
                          ...(yearMetrics.operationType === "equals" && {
                              equals: yearMetrics.year[0],
                          }),
                      }
                    : yearMetrics?.year?.length === 2 && yearMetrics?.operationType === "in"
                      ? {
                            gte: yearMetrics.year[0],
                            lte: yearMetrics.year[1],
                        }
                      : undefined
                : undefined,
        ...(partnerType === "broadcast"
            ? {
                  dashapp_broadcastpartner:
                      partnerIdMetrics?.partnerType === partnerType && partnerIdMetrics.partnerIds?.length
                          ? {
                                id: { in: partnerIdMetrics.partnerIds.map((id) => BigInt(id)) },
                            }
                          : undefined,
              }
            : {
                  dashapp_ottpartner:
                      partnerIdMetrics?.partnerType === partnerType && partnerIdMetrics.partnerIds?.length
                          ? {
                                id: { in: partnerIdMetrics.partnerIds.map((id) => BigInt(id)) },
                            }
                          : undefined,
              }),
    };
    return query;
};
