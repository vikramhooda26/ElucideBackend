import bcrypt from "bcrypt";

const salt = 10;

export const getHashedPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
};
