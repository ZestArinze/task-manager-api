import { Body, Controller, Post } from '@nestjs/common';
import { LoginQuery } from '../users/dtos/login.query';
import { UserQuery } from '../users/dtos/user.query';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
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

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginQuery> {
    const result = await this.authService.login(dto);

    return {
      successful: true,
      message: 'Login successful',
      data: { access_token: result },
    };
  }
}
