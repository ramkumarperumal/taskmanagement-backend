import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

enum TaskStatus {
  TODO = 'Todo',
  INPROGRESS = 'Inprogress',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  task_name: String;

  @IsOptional()
  @IsString()
  description: String;

  @IsNotEmpty()
  due_date: Date;

  @IsNotEmpty()
  @IsEnum(Priority)
  priority: String;

  @IsNotEmpty()
  assignee: String;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: String;

  @IsOptional()
  created_by: String;
}
