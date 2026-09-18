"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseDto = exports.RegisterResponseDto = exports.RegisteredUserDto = exports.UserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserProfileDto {
    id;
    name;
    email;
    createdAt;
    updatedAt;
}
exports.UserProfileDto = UserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '68c85e94de6b108875d46f12',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Juan Pérez',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'juan@gmail.com',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-09-18T14:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-09-18T14:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "updatedAt", void 0);
class RegisteredUserDto {
    id;
    name;
    email;
}
exports.RegisteredUserDto = RegisteredUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '68c85e94de6b108875d46f12',
    }),
    __metadata("design:type", String)
], RegisteredUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Juan Pérez',
    }),
    __metadata("design:type", String)
], RegisteredUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'juan@gmail.com',
    }),
    __metadata("design:type", String)
], RegisteredUserDto.prototype, "email", void 0);
class RegisterResponseDto {
    message;
    user;
}
exports.RegisterResponseDto = RegisterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Usuario registrado correctamente',
    }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: RegisteredUserDto,
    }),
    __metadata("design:type", RegisteredUserDto)
], RegisterResponseDto.prototype, "user", void 0);
class LoginResponseDto {
    message;
    access_token;
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Inicio de sesión exitoso',
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "access_token", void 0);
//# sourceMappingURL=auth-response.dto.js.map