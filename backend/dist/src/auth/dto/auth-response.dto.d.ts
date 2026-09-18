export declare class UserProfileDto {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class RegisteredUserDto {
    id: string;
    name: string;
    email: string;
}
export declare class RegisterResponseDto {
    message: string;
    user: RegisteredUserDto;
}
export declare class LoginResponseDto {
    message: string;
    access_token: string;
}
