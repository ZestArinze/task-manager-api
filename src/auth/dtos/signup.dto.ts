import { IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  password_confirmation: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
