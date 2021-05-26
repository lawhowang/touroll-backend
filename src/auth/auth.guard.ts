import { Inject, SetMetadata } from '@nestjs/common';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const optionalKey = 'auth-guard-optional';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector
  ) { }
  async canActivate(
    context: ExecutionContext,
  ) {
    const optional = this.reflector.get<boolean>(optionalKey, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const tAuthorization = request.header('T-Authorization');
    if (tAuthorization) {
      const user = await this.authService.validateToken(tAuthorization);
      if (user) {
        request.user = user
        return true
      }
    }
    const authorization = request.header('Authorization');
    if (!authorization) {
      return optional || false;
    }
    const user = await this.authService.validateFirebaseToken(authorization);
    if (!user) {
      return optional || false
    }
    request.user = user
    return true
  }
}

export const SetAuthGuardOptional = () => SetMetadata(optionalKey, true);