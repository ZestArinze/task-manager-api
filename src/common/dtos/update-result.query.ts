import { ApiResponse } from './api-response.dto';

export class UpdateResultQuery extends ApiResponse {
  data: {
    affected: number;
  };
}
