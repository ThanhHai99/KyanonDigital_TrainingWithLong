import { EnumRole } from '@constant/role/role.constant'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: EnumRole[]) => SetMetadata(ROLES_KEY, roles)
