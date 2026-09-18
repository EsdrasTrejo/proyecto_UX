import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    example: '68c85e94de6b108875d46f12',
  })
  id!: string;

  @ApiProperty({
    example: 'Juan Pérez',
  })
  name!: string;

  @ApiProperty({
    example: 'juan@gmail.com',
  })
  email!: string;

  @ApiProperty({
    example: '2026-09-18T14:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-09-18T14:00:00.000Z',
  })
  updatedAt!: Date;
}

export class RegisteredUserDto {
  @ApiProperty({
    example: '68c85e94de6b108875d46f12',
  })
  id!: string;

  @ApiProperty({
    example: 'Juan Pérez',
  })
  name!: string;

  @ApiProperty({
    example: 'juan@gmail.com',
  })
  email!: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: 'Usuario registrado correctamente',
  })
  message!: string;

  @ApiProperty({
    type: RegisteredUserDto,
  })
  user!: RegisteredUserDto;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'Inicio de sesión exitoso',
  })
  message!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;
}
