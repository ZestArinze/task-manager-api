import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enums/index.enum';

export class SearchTasksDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsInt()
  @IsOptional()
  project_id?: number;

  user_id: number;
}
