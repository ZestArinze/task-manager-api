import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Exists } from '../../common/validators/exists.validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  completed_at?: Date;

  @IsInt()
  @Exists({
    context: {
      table: 'project',
      col: 'id',
      inputProperty: 'project_id',
    },
  })
  project_id: number;
}
