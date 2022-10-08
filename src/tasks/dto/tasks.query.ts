import { ApiResponse } from '../../common/dtos/api-response.dto';
import { Task } from '../entities/task.entity';

export class TasksQuery extends ApiResponse {
  data: Task[];
}
