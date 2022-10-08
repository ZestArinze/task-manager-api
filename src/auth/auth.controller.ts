import { Body, Controller, Post } from '@nestjs/common';
import { UserQuery } from '../users/dtos/user.query';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<UserQuery> {
    const result = await this.authService.signup(dto);

    return {
      successful: true,
      message: 'Account created',
      data: result,
    };
  }
}
