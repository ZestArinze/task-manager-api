import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { ALLOWS_GUEST_KEY } from '../decorators/allow-guest.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  private invalidMsg = 'Valid access token required';

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const allowsGuest = this.reflector.getAllAndOverride(ALLOWS_GUEST_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (allowsGuest) {
      return true;
    }

    const token = this.getToken(req);
    const tokenPayload = await this.authService.verifyAndGetTokenData(token);

    if (!tokenPayload) {
      throw new UnauthorizedException(this.invalidMsg);
    }

    const user = await this.usersService.findOne(tokenPayload.username);
    if (!tokenPayload) {
      throw new UnauthorizedException(this.invalidMsg);
    }

    req.user = user;

    return true;
  }

  protected getToken(request: { headers: Record<string, string> }): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new UnauthorizedException(this.invalidMsg);
    }

    const [_, token] = authorization.split(' ');

    return token;
  }
  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }
}
