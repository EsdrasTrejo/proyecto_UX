import { ApiProperty } from '@nestjs/swagger';

export class HabitRecordResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  date!: Date;

  @ApiProperty({
    example: true,
  })
  completed!: boolean;

  @ApiProperty()
  habitId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
