import { ApiResponse } from '../../common/dtos/api-response.dto';
import { Project } from '../entities/project.entity';

export class ProjectsQuery extends ApiResponse {
  data: Project[];
}
