import { IsOptional, IsString } from 'class-validator';

export class SearchProjectsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  title?: string;

  user_id: number;
}
