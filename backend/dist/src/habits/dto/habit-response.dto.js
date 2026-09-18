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
exports.HabitResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class HabitResponseDto {
    id;
    name;
    description;
    category;
    frequency;
    weeklyDay;
    customDays;
    priority;
    startDate;
    endDate;
    active;
    createdAt;
    updatedAt;
    userId;
}
exports.HabitResponseDto = HabitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '68c85e94de6b108875d46f12',
    }),
    __metadata("design:type", String)
], HabitResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Hacer ejercicio',
    }),
    __metadata("design:type", String)
], HabitResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Entrenar 30 minutos',
        nullable: true,
    }),
    __metadata("design:type", Object)
], HabitResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Salud',
        nullable: true,
    }),
    __metadata("design:type", Object)
], HabitResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.HabitFrequency,
    }),
    __metadata("design:type", String)
], HabitResponseDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.HabitDay,
        nullable: true,
    }),
    __metadata("design:type", Object)
], HabitResponseDto.prototype, "weeklyDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.HabitDay,
        isArray: true,
    }),
    __metadata("design:type", Array)
], HabitResponseDto.prototype, "customDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.HabitPriority,
    }),
    __metadata("design:type", String)
], HabitResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], HabitResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        nullable: true,
    }),
    __metadata("design:type", Object)
], HabitResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
    }),
    __metadata("design:type", Boolean)
], HabitResponseDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], HabitResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], HabitResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '68c85e94de6b108875d46f10',
    }),
    __metadata("design:type", String)
], HabitResponseDto.prototype, "userId", void 0);
//# sourceMappingURL=habit-response.dto.js.map