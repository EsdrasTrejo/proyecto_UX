import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  LoginResponseDto,
  RegisterResponseDto,
  UserProfileDto,
} from './dto/auth-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Correo o contraseña incorrectos',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'El correo ya está registrado',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  getProfile(
    @Req()
    request: Request & {
      user: {
        sub: string;
        email: string;
      };
    },
  ) {
    return this.authService.getProfile(request.user.sub);
  }
}
