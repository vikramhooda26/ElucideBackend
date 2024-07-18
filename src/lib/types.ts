export const roles = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    USER: "USER",
} as const;

export type TRole = (typeof roles)[keyof typeof roles];

export type TUser = {
    id: number;
    username: string;
    role: TRole;
};
