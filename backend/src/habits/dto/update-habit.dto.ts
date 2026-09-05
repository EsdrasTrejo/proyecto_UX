import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { HabitDay, HabitFrequency, HabitPriority } from '@prisma/client';

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(HabitFrequency)
  frequency?: HabitFrequency;

  @IsOptional()
  @IsEnum(HabitDay)
  weeklyDay?: HabitDay;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(HabitDay, { each: true })
  customDays?: HabitDay[];

  @IsOptional()
  @IsEnum(HabitPriority)
  priority?: HabitPriority;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
