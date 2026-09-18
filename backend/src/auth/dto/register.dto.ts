import { IsEmail, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del usuario',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    example: 'juan@gmail.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '12345678',
    description: 'Contraseña del usuario. Mínimo 6 caracteres.',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
