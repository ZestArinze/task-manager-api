import { ApiResponse } from '../../common/dtos/api-response.dto';
import { Project } from '../entities/project.entity';

export class ProjectQuery extends ApiResponse {
  data: Project;
}
