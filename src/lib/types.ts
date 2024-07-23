export const roles = ["SUPER_ADMIN", "ADMIN", "STAFF", "USER"] as const;
export type TRole = (typeof roles)[number];

export type TUser = {
    userId: string;
    username: string;
    role: TRole;
};
