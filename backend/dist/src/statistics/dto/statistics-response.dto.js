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
exports.TrendResponseDto = exports.StreaksResponseDto = exports.HabitStreakDto = exports.MonthlyProgressResponseDto = exports.WeeklyProgressResponseDto = exports.ProgressDayDto = exports.SummaryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SummaryResponseDto {
    totalHabits;
    activeHabits;
    finishedHabits;
    habitsToday;
    completedToday;
    pendingToday;
    completionPercentage;
}
exports.SummaryResponseDto = SummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SummaryResponseDto.prototype, "totalHabits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SummaryResponseDto.prototype, "activeHabits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SummaryResponseDto.prototype, "finishedHabits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SummaryResponseDto.prototype, "habitsToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SummaryResponseDto.prototype, "completedToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SummaryResponseDto.prototype, "pendingToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 75,
        description: 'Porcentaje de cumplimiento de hoy',
    }),
    __metadata("design:type", Number)
], SummaryResponseDto.prototype, "completionPercentage", void 0);
class ProgressDayDto {
    date;
    scheduled;
    completed;
    percentage;
}
exports.ProgressDayDto = ProgressDayDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProgressDayDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProgressDayDto.prototype, "scheduled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProgressDayDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProgressDayDto.prototype, "percentage", void 0);
class WeeklyProgressResponseDto {
    startDate;
    endDate;
    scheduled;
    completed;
    pending;
    percentage;
    days;
}
exports.WeeklyProgressResponseDto = WeeklyProgressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], WeeklyProgressResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], WeeklyProgressResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], WeeklyProgressResponseDto.prototype, "scheduled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], WeeklyProgressResponseDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], WeeklyProgressResponseDto.prototype, "pending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], WeeklyProgressResponseDto.prototype, "percentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: ProgressDayDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], WeeklyProgressResponseDto.prototype, "days", void 0);
class MonthlyProgressResponseDto {
    year;
    month;
    scheduled;
    completed;
    pending;
    percentage;
    days;
}
exports.MonthlyProgressResponseDto = MonthlyProgressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyProgressResponseDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyProgressResponseDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyProgressResponseDto.prototype, "scheduled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyProgressResponseDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyProgressResponseDto.prototype, "pending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyProgressResponseDto.prototype, "percentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: ProgressDayDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], MonthlyProgressResponseDto.prototype, "days", void 0);
class HabitStreakDto {
    habitId;
    name;
    frequency;
    currentStreak;
    bestStreak;
}
exports.HabitStreakDto = HabitStreakDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HabitStreakDto.prototype, "habitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HabitStreakDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HabitStreakDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], HabitStreakDto.prototype, "currentStreak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], HabitStreakDto.prototype, "bestStreak", void 0);
class StreaksResponseDto {
    longestCurrentStreak;
    bestStreak;
    habits;
}
exports.StreaksResponseDto = StreaksResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StreaksResponseDto.prototype, "longestCurrentStreak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StreaksResponseDto.prototype, "bestStreak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: HabitStreakDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], StreaksResponseDto.prototype, "habits", void 0);
class TrendResponseDto {
    startDate;
    endDate;
    days;
}
exports.TrendResponseDto = TrendResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TrendResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TrendResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: ProgressDayDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], TrendResponseDto.prototype, "days", void 0);
//# sourceMappingURL=statistics-response.dto.js.map