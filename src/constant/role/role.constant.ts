export enum EnumRole {
    super_admin = 1,
    warehouse_manager = 2,
    business_manager = 3
}

export const RolesAsObject = Object.fromEntries(
    Object.entries(EnumRole).filter((e) => isNaN(Number(e[0])))
);

export const RoleIds: number[] = Object.values(RolesAsObject).map((e: any) =>
    parseInt(e)
);
export const RoleNames: string[] = Object.keys(RolesAsObject);
