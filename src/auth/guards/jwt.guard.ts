import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  private invalidMsg = 'Valid access token required';

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

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
