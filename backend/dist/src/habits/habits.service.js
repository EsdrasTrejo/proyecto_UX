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
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const date_utils_1 = require("../common/date.utils");
let HabitsService = class HabitsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(userId, createHabitDto) {
        const startDate = new Date(createHabitDto.startDate);
        const endDate = createHabitDto.endDate
            ? new Date(createHabitDto.endDate)
            : undefined;
        if (endDate && endDate < startDate) {
            throw new common_1.BadRequestException('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
        const schedule = this.normalizeFrequency(createHabitDto.frequency, createHabitDto.weeklyDay, createHabitDto.customDays);
        return this.prisma.habit.create({
            data: {
                name: createHabitDto.name,
                description: createHabitDto.description,
                category: createHabitDto.category,
                frequency: createHabitDto.frequency,
                weeklyDay: schedule.weeklyDay,
                customDays: schedule.customDays,
                priority: createHabitDto.priority,
                startDate,
                endDate,
                userId,
            },
        });
    }
    normalizeFrequency(frequency, weeklyDay, customDays) {
        if (frequency === client_1.HabitFrequency.DAILY) {
            return {
                weeklyDay: null,
                customDays: [],
            };
        }
        if (frequency === client_1.HabitFrequency.WEEKLY) {
            if (!weeklyDay) {
                throw new common_1.BadRequestException('Debes seleccionar un día para la frecuencia semanal');
            }
            return {
                weeklyDay,
                customDays: [],
            };
        }
        if (frequency === client_1.HabitFrequency.CUSTOM &&
            (!customDays || customDays.length === 0)) {
            throw new common_1.BadRequestException('Debes seleccionar al menos un día para una frecuencia personalizada');
        }
        return {
            weeklyDay: null,
            customDays: customDays ?? [],
        };
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
    async markToday(id, userId, markHabitDto) {
        const habit = await this.findOne(id, userId);
        const today = (0, date_utils_1.getToday)();
        const todayDay = (0, date_utils_1.getHabitDay)(today);
        if (!habit.active) {
            throw new common_1.BadRequestException('No puedes completar un hábito inactivo');
        }
        if (habit.startDate > today) {
            throw new common_1.BadRequestException('Este hábito todavía no ha iniciado');
        }
        if (habit.endDate && habit.endDate < today) {
            throw new common_1.BadRequestException('Este hábito ya finalizó');
        }
        let correspondsToday = false;
        if (habit.frequency === client_1.HabitFrequency.DAILY) {
            correspondsToday = true;
        }
        if (habit.frequency === client_1.HabitFrequency.WEEKLY &&
            habit.weeklyDay === todayDay) {
            correspondsToday = true;
        }
        if (habit.frequency === client_1.HabitFrequency.CUSTOM &&
            habit.customDays.includes(todayDay)) {
            correspondsToday = true;
        }
        if (!correspondsToday) {
            throw new common_1.BadRequestException('Este hábito no corresponde al día de hoy');
        }
        return this.prisma.habitRecord.upsert({
            where: {
                habitId_userId_date: {
                    habitId: id,
                    userId,
                    date: today,
                },
            },
            update: {
                completed: markHabitDto.completed,
            },
            create: {
                habitId: id,
                userId,
                date: today,
                completed: markHabitDto.completed,
            },
        });
    }
    async update(id, userId, updateHabitDto) {
        const habit = await this.findOne(id, userId);
        const startDate = updateHabitDto.startDate
            ? new Date(updateHabitDto.startDate)
            : habit.startDate;
        const endDate = updateHabitDto.endDate
            ? new Date(updateHabitDto.endDate)
            : habit.endDate;
        if (endDate && endDate < startDate) {
            throw new common_1.BadRequestException('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
        const frequency = updateHabitDto.frequency ?? habit.frequency;
        const weeklyDay = updateHabitDto.weeklyDay ?? habit.weeklyDay ?? undefined;
        const customDays = updateHabitDto.customDays ?? habit.customDays;
        const schedule = this.normalizeFrequency(frequency, weeklyDay, customDays);
        return this.prisma.habit.update({
            where: {
                id,
            },
            data: {
                name: updateHabitDto.name,
                description: updateHabitDto.description,
                category: updateHabitDto.category,
                frequency,
                weeklyDay: schedule.weeklyDay,
                customDays: schedule.customDays,
                priority: updateHabitDto.priority,
                startDate: updateHabitDto.startDate ? startDate : undefined,
                endDate: updateHabitDto.endDate ? endDate : undefined,
                active: updateHabitDto.active,
            },
        });
    }
    async findRecords(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.habitRecord.findMany({
            where: {
                habitId: id,
                userId,
            },
            orderBy: {
                date: 'desc',
            },
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        await this.prisma.habitRecord.deleteMany({
            where: {
                habitId: id,
                userId,
            },
        });
        await this.prisma.habit.delete({
            where: {
                id,
            },
        });
        return {
            message: 'Hábito eliminado correctamente',
        };
    }
    async findToday(userId) {
        const today = (0, date_utils_1.getToday)();
        const todayDay = (0, date_utils_1.getHabitDay)(today);
        const habits = await this.prisma.habit.findMany({
            where: {
                userId,
                active: true,
                startDate: {
                    lte: today,
                },
                AND: [
                    {
                        OR: [
                            {
                                endDate: null,
                            },
                            {
                                endDate: {
                                    gte: today,
                                },
                            },
                        ],
                    },
                    {
                        OR: [
                            {
                                frequency: client_1.HabitFrequency.DAILY,
                            },
                            {
                                frequency: client_1.HabitFrequency.WEEKLY,
                                weeklyDay: todayDay,
                            },
                            {
                                frequency: client_1.HabitFrequency.CUSTOM,
                                customDays: {
                                    has: todayDay,
                                },
                            },
                        ],
                    },
                ],
            },
            include: {
                records: {
                    where: {
                        date: today,
                    },
                    select: {
                        completed: true,
                    },
                },
            },
            orderBy: {
                priority: 'desc',
            },
        });
        return habits.map(({ records, ...habit }) => ({
            ...habit,
            completedToday: records[0]?.completed ?? false,
        }));
    }
};
exports.HabitsService = HabitsService;
exports.HabitsService = HabitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HabitsService);
//# sourceMappingURL=habits.service.js.map