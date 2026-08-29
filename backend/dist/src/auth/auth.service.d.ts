import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
    }>;
}
