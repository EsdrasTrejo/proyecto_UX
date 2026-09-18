import { ApiProperty } from '@nestjs/swagger';

import { HabitDay, HabitFrequency, HabitPriority } from '@prisma/client';

export class HabitResponseDto {
  @ApiProperty({
    example: '68c85e94de6b108875d46f12',
  })
  id!: string;

  @ApiProperty({
    example: 'Hacer ejercicio',
  })
  name!: string;

  @ApiProperty({
    example: 'Entrenar 30 minutos',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    example: 'Salud',
    nullable: true,
  })
  category!: string | null;

  @ApiProperty({
    enum: HabitFrequency,
  })
  frequency!: HabitFrequency;

  @ApiProperty({
    enum: HabitDay,
    nullable: true,
  })
  weeklyDay!: HabitDay | null;

  @ApiProperty({
    enum: HabitDay,
    isArray: true,
  })
  customDays!: HabitDay[];

  @ApiProperty({
    enum: HabitPriority,
  })
  priority!: HabitPriority;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty({
    nullable: true,
  })
  endDate!: Date | null;

  @ApiProperty({
    example: true,
  })
  active!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({
    example: '68c85e94de6b108875d46f10',
  })
  userId!: string;
}
