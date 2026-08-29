import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // 1. Revisar si el correo ya existe
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este correo');
    }

    // 2. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear usuario
    const user = await this.usersService.create(name, email, hashedPassword);

    // 4. Devolver usuario SIN contraseña
    return {
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscar usuario por correo
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // 2. Comparar contraseña
    const passwordCorrecta = await bcrypt.compare(password, user.password);

    if (!passwordCorrecta) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // 3. Información que guardaremos dentro del JWT
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // 4. Crear JWT
    const accessToken = await this.jwtService.signAsync(payload);

    // 5. Devolver token
    return {
      message: 'Inicio de sesión exitoso',
      access_token: accessToken,
    };
  }
}
