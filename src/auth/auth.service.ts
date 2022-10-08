import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dtos/signup.dto';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { LoginDto } from './dtos/login.dto';
import { JwtTokenPayload } from './dtos/jwt-token-payload.dro';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    dto.password = hash;

    return await this.usersService.create(dto);
  }

  async login(dto: LoginDto) {
    const invalidMsg = 'Incorrect login credentials';

    const user = await this.validateUsernameAndPassword(dto);
    if (!user) {
      throw new UnauthorizedException(invalidMsg);
    }

    return this.createAccessToken({ username: user.username, userId: user.id });
  }

  async createAccessToken(data: { userId: number; username: string }) {
    const payload: JwtTokenPayload = {
      username: data.username,
      sub: data.userId + '',
    };

    return jwt.sign(payload, this.configService.get<string>('JWT_SECRET'));
  }

  async validateUsernameAndPassword({ username, password }: LoginDto) {
    const user = await this.usersService.findOne(username, {
      selectSecrets: true,
    });

    if (!user) {
      return null;
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return null;
      }
    } catch (error) {
      return null;
    }

    return user;
  }

  async verifyAndGetTokenData(token: string): Promise<JwtTokenPayload | null> {
    let payload = null;

    try {
      payload = jwt.verify(
        token,
        this.configService.get<string>('JWT_SECRET'),
      ) as JwtTokenPayload;
    } catch (error) {}

    return payload;
  }
}
