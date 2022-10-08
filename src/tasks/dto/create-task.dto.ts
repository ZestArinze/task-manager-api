import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Exists } from '../../common/validators/exists.validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  completed_at?: Date;

  @IsInt()
  @Min(1)
  @Exists({
    context: {
      table: 'project',
      col: 'id',
      inputProperty: 'project_id',
    },
  })
  project_id: number;
}
