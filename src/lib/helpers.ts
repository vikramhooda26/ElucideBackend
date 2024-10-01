import bcrypt from "bcrypt";
import { BadRequestError } from "./errors.js";

const salt = 10;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
};

export const validateRangeFormat = (ageRange: string): boolean => {
    if (ageRange.includes("+")) {
        const parts = ageRange.split("+");
        const [minAge, plus] = parts;
        if (parts.length !== 2 || plus !== "" || Number.isNaN(Number(minAge)) || Number(minAge) < 0) {
            return false;
        }
        return true;
    }
    if (ageRange.includes("-")) {
        const parts = ageRange.split("-");
        const [minAge, maxAge] = parts;
        if (
            parts.length !== 2 ||
            Number.isNaN(Number(maxAge)) ||
            Number.isNaN(Number(minAge)) ||
            Number(minAge) < 0 ||
            Number(maxAge) < 0
        ) {
            return false;
        }
        return true;
    }
    return false;
};

export const convertStringToInt = (number: string) => {
    const parsedAge = parseInt(number, 10);
    if (isNaN(parsedAge)) {
        throw new BadRequestError("Invalid input: Expected a string representing a positive integer.");
    }
    return parsedAge;
};

export const convertStringToBigInt = (number: string) => {
    if (!/^\d+$/.test(number)) {
        throw new BadRequestError("Invalid input: Expected a string representing a bigint.");
    }
    return BigInt(number);
};

export const getRange = (range: string) => {
    const isValidFormat = validateRangeFormat(range);

    if (!isValidFormat) {
        throw new BadRequestError("Invalid range format");
    }

    const parts = range.split("-");

    return parts;
};

export const areElementsDistinct = (arr: any[]) => {
    let set = new Set(arr);
    return set.size === arr.length;
};
