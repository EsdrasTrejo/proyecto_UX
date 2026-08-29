import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    getProfile(request: Request & {
        user: {
            sub: string;
            email: string;
        };
    }): {
        sub: string;
        email: string;
    };
}
