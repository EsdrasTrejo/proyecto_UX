import { IsBoolean } from 'class-validator';

export class MarkHabitDto {
  @IsBoolean()
  completed!: boolean;
}
