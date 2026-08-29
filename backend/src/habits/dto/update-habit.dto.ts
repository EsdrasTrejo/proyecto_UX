import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
