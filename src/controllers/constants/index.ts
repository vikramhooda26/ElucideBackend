import { prisma } from "../../db/index.js";
import { NotFoundError } from "../../lib/errors.js";

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

        if (!genderInDatabase) {
            throw new NotFoundError("This gender ID does not exist");
        }

        const notIn = genders.filter((gender) => gender.id !== genderInDatabase.id).map((gender) => gender.id);

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

    return query;
};
