export enum AssetType {
    IMAGE = "IMAGE",
    ICON = "ICON",
    LOGO = "LOGO",
    SHAPE = "SHAPE",
    LOCKUP = "LOCKUP",
    KEYWORD = "KEYWORD",
}

export const AssetTypeLabel: Record<AssetType, string> = {
    [AssetType.IMAGE]: "Imagen",
    [AssetType.ICON]: "Ícono",
    [AssetType.LOGO]: "Logo",
    [AssetType.SHAPE]: "Formas",
    [AssetType.LOCKUP]: "Lockup",
    [AssetType.KEYWORD]: "Keywords",
};
