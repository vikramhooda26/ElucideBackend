import bcrypt from "bcrypt";

const salt = 10;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
};
