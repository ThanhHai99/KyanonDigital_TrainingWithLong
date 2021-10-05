import { EnumRole } from '@constant/role/role.constant';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'decorator/role/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<EnumRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();

    // Setup multiple permission here
    return requiredRoles.some((roleId) => user.roleId === roleId);
  }
}
