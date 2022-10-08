import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const { password, ...userData } = req.user;

    return userData;
  },
);
