export type TRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "USER";

export type TUser = {
    id: number;
    username: string;
    role: TRole;
};
