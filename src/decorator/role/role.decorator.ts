import { SetMetadata } from '@nestjs/common';
import { EnumRole } from '@constant/role/role.constant';

export const ROLES_KEY = 'id';
export const Roles = (...roles: EnumRole[]) => SetMetadata(ROLES_KEY, roles);
