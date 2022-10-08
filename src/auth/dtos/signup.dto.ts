import { IsString, MinLength } from 'class-validator';
import { IsAMatch } from '../../common/validators/is-a-match.validator';
import { NotExists } from '../../common/validators/not-exists.validator';
import { IsPasswordWorthy } from '../validators/is-password-worthy.validator';

export class SignupDto {
  @IsString()
  @NotExists({
    context: {
      table: 'user',
      col: 'username',
      inputProperty: 'username',
    },
  })
  username: string;

  @IsString()
  @MinLength(8)
  @IsPasswordWorthy()
  password: string;

  @IsString()
  @IsAMatch('password', {
    message: 'password and password comfirmation do not match',
  })
  password_confirmation: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
