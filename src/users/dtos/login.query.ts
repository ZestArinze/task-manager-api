import { ApiResponse } from '../../common/dtos/api-response.dto';

export class LoginQuery extends ApiResponse {
  data: { access_token: string };
}
