import { ApiProperty } from '@nestjs/swagger';

export class SummaryResponseDto {
  @ApiProperty()
  totalHabits!: number;

  @ApiProperty()
  activeHabits!: number;

  @ApiProperty()
  finishedHabits!: number;

  @ApiProperty()
  habitsToday!: number;

  @ApiProperty()
  completedToday!: number;

  @ApiProperty()
  pendingToday!: number;

  @ApiProperty({
    example: 75,
    description: 'Porcentaje de cumplimiento de hoy',
  })
  completionPercentage!: number;
}

export class ProgressDayDto {
  @ApiProperty()
  date!: Date;

  @ApiProperty()
  scheduled!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty()
  percentage!: number;
}

export class WeeklyProgressResponseDto {
  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  endDate!: Date;

  @ApiProperty()
  scheduled!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty()
  pending!: number;

  @ApiProperty()
  percentage!: number;

  @ApiProperty({
    type: ProgressDayDto,
    isArray: true,
  })
  days!: ProgressDayDto[];
}

export class MonthlyProgressResponseDto {
  @ApiProperty()
  year!: number;

  @ApiProperty()
  month!: number;

  @ApiProperty()
  scheduled!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty()
  pending!: number;

  @ApiProperty()
  percentage!: number;

  @ApiProperty({
    type: ProgressDayDto,
    isArray: true,
  })
  days!: ProgressDayDto[];
}

export class HabitStreakDto {
  @ApiProperty()
  habitId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  frequency!: string;

  @ApiProperty()
  currentStreak!: number;

  @ApiProperty()
  bestStreak!: number;
}

export class StreaksResponseDto {
  @ApiProperty()
  longestCurrentStreak!: number;

  @ApiProperty()
  bestStreak!: number;

  @ApiProperty({
    type: HabitStreakDto,
    isArray: true,
  })
  habits!: HabitStreakDto[];
}

export class TrendResponseDto {
  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  endDate!: Date;

  @ApiProperty({
    type: ProgressDayDto,
    isArray: true,
  })
  days!: ProgressDayDto[];
}
