import { IsBoolean } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class MarkHabitDto {
  @ApiProperty({
    example: true,
    description: 'Indica si el hábito fue completado en el día actual',
  })
  @IsBoolean()
  completed!: boolean;
}
