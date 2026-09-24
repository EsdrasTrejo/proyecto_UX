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
exports.CreateHabitDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
class CreateHabitDto {
    name;
    description;
    category;
    frequency;
    weeklyDay;
    customDays;
    priority;
    startDate;
    endDate;
}
exports.CreateHabitDto = CreateHabitDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Hacer ejercicio',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Entrenar durante 30 minutos',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Salud',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.HabitFrequency,
        example: client_1.HabitFrequency.CUSTOM,
    }),
    (0, class_validator_1.IsEnum)(client_1.HabitFrequency),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.HabitDay,
        example: client_1.HabitDay.MONDAY,
        description: 'Se utiliza cuando frequency es WEEKLY',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.HabitDay),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "weeklyDay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.HabitDay,
        isArray: true,
        example: [client_1.HabitDay.MONDAY, client_1.HabitDay.WEDNESDAY, client_1.HabitDay.FRIDAY],
        description: 'Se utiliza cuando frequency es CUSTOM',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsEnum)(client_1.HabitDay, {
        each: true,
    }),
    __metadata("design:type", Array)
], CreateHabitDto.prototype, "customDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.HabitPriority,
        example: client_1.HabitPriority.HIGH,
    }),
    (0, class_validator_1.IsEnum)(client_1.HabitPriority),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-09-18',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateHabitDto.prototype, "endDate", void 0);
//# sourceMappingURL=create-habit.dto.js.map