import { ApiResponse } from '../../common/dtos/api-response.dto';
import { User } from '../entities/user.entity';

export class UserQuery extends ApiResponse {
  data: User;
}
