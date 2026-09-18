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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const statistics_service_1 = require("./statistics.service");
const swagger_1 = require("@nestjs/swagger");
const statistics_response_dto_1 = require("./dto/statistics-response.dto");
let StatisticsController = class StatisticsController {
    statisticsService;
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    getSummary(request) {
        return this.statisticsService.getSummary(request.user.sub);
    }
    getWeeklyProgress(request) {
        return this.statisticsService.getWeeklyProgress(request.user.sub);
    }
    getMonthlyProgress(request) {
        return this.statisticsService.getMonthlyProgress(request.user.sub);
    }
    getStreaks(request) {
        return this.statisticsService.getStreaks(request.user.sub);
    }
    getTrend(request) {
        return this.statisticsService.getTrend(request.user.sub);
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener resumen general de hábitos',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: statistics_response_dto_1.SummaryResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('weekly'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener progreso semanal',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: statistics_response_dto_1.WeeklyProgressResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getWeeklyProgress", null);
__decorate([
    (0, common_1.Get)('monthly'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener progreso mensual',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: statistics_response_dto_1.MonthlyProgressResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getMonthlyProgress", null);
__decorate([
    (0, common_1.Get)('streaks'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener rachas de hábitos',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: statistics_response_dto_1.StreaksResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getStreaks", null);
__decorate([
    (0, common_1.Get)('trend'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener tendencia de cumplimiento de los últimos 30 días',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: statistics_response_dto_1.TrendResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getTrend", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, common_1.Controller)('statistics'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiTags)('Statistics'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map