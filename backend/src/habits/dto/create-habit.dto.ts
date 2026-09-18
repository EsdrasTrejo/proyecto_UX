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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHabitDto {
  @ApiProperty({
    example: 'Hacer ejercicio',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({
    example: 'Entrenar durante 30 minutos',
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

  @ApiProperty({
    enum: HabitFrequency,
    example: HabitFrequency.CUSTOM,
  })
  @IsEnum(HabitFrequency)
  frequency!: HabitFrequency;

  @ApiPropertyOptional({
    enum: HabitDay,
    example: HabitDay.MONDAY,
    description: 'Se utiliza cuando frequency es WEEKLY',
  })
  @IsOptional()
  @IsEnum(HabitDay)
  weeklyDay?: HabitDay;

  @ApiPropertyOptional({
    enum: HabitDay,
    isArray: true,
    example: [HabitDay.MONDAY, HabitDay.WEDNESDAY, HabitDay.FRIDAY],
    description: 'Se utiliza cuando frequency es CUSTOM',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(HabitDay, {
    each: true,
  })
  customDays?: HabitDay[];

  @ApiProperty({
    enum: HabitPriority,
    example: HabitPriority.HIGH,
  })
  @IsEnum(HabitPriority)
  priority!: HabitPriority;

  @ApiProperty({
    example: '2026-09-18',
  })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
