import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../../common/types';

/**
 * Extracts the authenticated user from the request object.
 * Usage: @CurrentUser() user: AuthUser
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
