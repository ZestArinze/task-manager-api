import { ApiResponse } from './api-response.dto';

export class DeleteResultQuery extends ApiResponse {
  data: {
    affected: number;
  };
}
