export enum UserRole {
    ADMIN = "ADMIN",
    FUNCTIONAL = "FUNCTIONAL",
    USER = "USER",
}

export const UserRoleLabel: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Super Admin",
    [UserRole.FUNCTIONAL]: "Admin Funcional",
    [UserRole.USER]: "Usuario General",
};
