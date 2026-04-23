export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    REMOVED = "REMOVED",
}

export const UserStatusLabel: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: "Habilitado",
    [UserStatus.INACTIVE]: "Deshabilitado",
    [UserStatus.REMOVED]: "Eliminado",
};
