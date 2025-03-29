import { IsOptional } from 'class-validator';

export class TaskFilterDto {
  @IsOptional()
  page: Number;

  @IsOptional()
  limit: Number;

  @IsOptional()
  priority: String;

  @IsOptional()
  status: String;
}
