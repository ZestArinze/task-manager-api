import { ApiResponse } from '../../common/dtos/api-response.dto';
import { Task } from '../entities/task.entity';

export class TaskQuery extends ApiResponse {
  data: Task;
}
