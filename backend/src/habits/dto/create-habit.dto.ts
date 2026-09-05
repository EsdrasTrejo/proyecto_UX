import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { HabitDay, HabitFrequency, HabitPriority } from '@prisma/client';

export class CreateHabitDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsEnum(HabitFrequency)
  frequency!: HabitFrequency;

  @IsOptional()
  @IsEnum(HabitDay)
  weeklyDay?: HabitDay;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(HabitDay, { each: true })
  customDays?: HabitDay[];

  @IsEnum(HabitPriority)
  priority!: HabitPriority;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
