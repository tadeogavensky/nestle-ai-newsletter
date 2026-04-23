export enum AreaName {
    COMUNICACION_INTERNA = "COMUNICACION_INTERNA",
    COMUNICACION_CORPORATIVA = "COMUNICACION_CORPORATIVA",
}

export const AreaNameLabel: Record<AreaName, string> = {
    [AreaName.COMUNICACION_INTERNA]: "Comunicación Interna",
    [AreaName.COMUNICACION_CORPORATIVA]: "Comunicación Corporativa",
};
