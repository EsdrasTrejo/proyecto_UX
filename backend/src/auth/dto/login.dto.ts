import { IsEmail, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'juan@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '12345678',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
