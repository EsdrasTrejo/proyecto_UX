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
exports.HabitsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const habits_service_1 = require("./habits.service");
const create_habit_dto_1 = require("./dto/create-habit.dto");
const update_habit_dto_1 = require("./dto/update-habit.dto");
const mark_habit_dto_1 = require("./dto/mark-habit.dto");
const mongo_id_pipe_1 = require("../common/pipes/mongo-id.pipe");
const swagger_1 = require("@nestjs/swagger");
const habit_response_dto_1 = require("./dto/habit-response.dto");
const habit_record_response_dto_1 = require("./dto/habit-record-response.dto");
let HabitsController = class HabitsController {
    habitsService;
    constructor(habitsService) {
        this.habitsService = habitsService;
    }
    create(request, createHabitDto) {
        return this.habitsService.create(request.user.sub, createHabitDto);
    }
    findAll(request) {
        return this.habitsService.findAll(request.user.sub);
    }
    findOne(id, request) {
        return this.habitsService.findOne(id, request.user.sub);
    }
    update(id, request, updateHabitDto) {
        return this.habitsService.update(id, request.user.sub, updateHabitDto);
    }
    remove(id, request) {
        return this.habitsService.remove(id, request.user.sub);
    }
    markToday(id, request, markHabitDto) {
        return this.habitsService.markToday(id, request.user.sub, markHabitDto);
    }
    findRecords(id, request) {
        return this.habitsService.findRecords(id, request.user.sub);
    }
    findToday(request) {
        return this.habitsService.findToday(request.user.sub);
    }
};
exports.HabitsController = HabitsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Crear un hábito',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: habit_response_dto_1.HabitResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Datos inválidos',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_habit_dto_1.CreateHabitDto]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener todos los hábitos del usuario',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: habit_response_dto_1.HabitResponseDto,
        isArray: true,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener un hábito por ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ObjectId del hábito',
        example: '68c85e94de6b108875d46f12',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: habit_response_dto_1.HabitResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'ID inválido',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Hábito no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.MongoIdPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualizar un hábito',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: '68c85e94de6b108875d46f12',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: habit_response_dto_1.HabitResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Hábito no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.MongoIdPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_habit_dto_1.UpdateHabitDto]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Eliminar un hábito',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Hábito eliminado correctamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Hábito no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.MongoIdPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/records/today'),
    (0, swagger_1.ApiOperation)({
        summary: 'Marcar o desmarcar un hábito como completado hoy',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: habit_record_response_dto_1.HabitRecordResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'El hábito no corresponde hoy o está inactivo',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Hábito no encontrado',
    }),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.MongoIdPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, mark_habit_dto_1.MarkHabitDto]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "markToday", null);
__decorate([
    (0, common_1.Get)(':id/records'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener historial de cumplimiento de un hábito',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: habit_record_response_dto_1.HabitRecordResponseDto,
        isArray: true,
    }),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.MongoIdPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "findRecords", null);
__decorate([
    (0, common_1.Get)('today'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener los hábitos programados para hoy',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de hábitos correspondientes al día actual',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "findToday", null);
exports.HabitsController = HabitsController = __decorate([
    (0, common_1.Controller)('habits'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiTags)('Habits'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('habits'),
    __metadata("design:paramtypes", [habits_service_1.HabitsService])
], HabitsController);
//# sourceMappingURL=habits.controller.js.map