import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthRequest } from './auth.guard';
import { Roles } from '../roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request: AuthRequest = context.switchToHttp().getRequest();
    const user = request.user;
    return user.roles.some((userRole) => roles.includes(userRole));
  }
}