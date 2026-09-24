import { ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiPropertyOptional({
    example: 'Hacer ejercicio',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({
    example: 'Entrenar 45 minutos',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Salud',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    enum: HabitFrequency,
  })
  @IsOptional()
  @IsEnum(HabitFrequency)
  frequency?: HabitFrequency;

  @ApiPropertyOptional({
    enum: HabitDay,
  })
  @IsOptional()
  @IsEnum(HabitDay)
  weeklyDay?: HabitDay;

  @ApiPropertyOptional({
    enum: HabitDay,
    isArray: true,
    example: [HabitDay.MONDAY, HabitDay.WEDNESDAY],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(HabitDay, {
    each: true,
  })
  customDays?: HabitDay[];

  @ApiPropertyOptional({
    enum: HabitPriority,
  })
  @IsOptional()
  @IsEnum(HabitPriority)
  priority?: HabitPriority;

  @ApiPropertyOptional({
    example: '2026-09-18',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
