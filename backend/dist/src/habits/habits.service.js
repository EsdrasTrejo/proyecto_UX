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
exports.HabitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HabitsService = class HabitsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(userId, createHabitDto) {
        return this.prisma.habit.create({
            data: {
                name: createHabitDto.name,
                description: createHabitDto.description,
                userId,
            },
        });
    }
    findAll(userId) {
        return this.prisma.habit.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id, userId) {
        const habit = await this.prisma.habit.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Hábito no encontrado');
        }
        return habit;
    }
    async update(id, userId, updateHabitDto) {
        await this.findOne(id, userId);
        return this.prisma.habit.update({
            where: {
                id,
            },
            data: updateHabitDto,
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        await this.prisma.habit.delete({
            where: {
                id,
            },
        });
        return {
            message: 'Hábito eliminado correctamente',
        };
    }
};
exports.HabitsService = HabitsService;
exports.HabitsService = HabitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HabitsService);
//# sourceMappingURL=habits.service.js.map