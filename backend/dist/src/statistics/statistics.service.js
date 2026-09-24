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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const date_utils_1 = require("../common/date.utils");
let StatisticsService = class StatisticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(userId) {
        const today = (0, date_utils_1.getToday)();
        const todayDay = (0, date_utils_1.getHabitDay)(today);
        const totalHabits = await this.prisma.habit.count({
            where: {
                userId,
            },
        });
        const finishedHabits = await this.prisma.habit.count({
            where: {
                userId,
                endDate: {
                    lt: today,
                },
            },
        });
        const activeHabits = await this.prisma.habit.count({
            where: {
                userId,
                active: true,
                startDate: {
                    lte: today,
                },
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
        });
        const todayHabits = await this.prisma.habit.findMany({
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
        });
        const habitsToday = todayHabits.length;
        const completedToday = todayHabits.filter((habit) => habit.records[0]?.completed === true).length;
        const pendingToday = habitsToday - completedToday;
        const completionPercentage = habitsToday === 0 ? 0 : Math.round((completedToday / habitsToday) * 100);
        return {
            totalHabits,
            activeHabits,
            habitsToday,
            finishedHabits,
            completedToday,
            pendingToday,
            completionPercentage,
        };
    }
    isHabitScheduledForDate(habit, date) {
        const day = (0, date_utils_1.normalizeDate)(date);
        const startDate = (0, date_utils_1.normalizeDate)(habit.startDate);
        const endDate = habit.endDate ? (0, date_utils_1.normalizeDate)(habit.endDate) : null;
        if (day < startDate) {
            return false;
        }
        if (endDate && day > endDate) {
            return false;
        }
        const habitDay = (0, date_utils_1.getHabitDay)(day);
        if (habit.frequency === client_1.HabitFrequency.DAILY) {
            return true;
        }
        if (habit.frequency === client_1.HabitFrequency.WEEKLY) {
            return habit.weeklyDay === habitDay;
        }
        if (habit.frequency === client_1.HabitFrequency.CUSTOM) {
            return habit.customDays.includes(habitDay);
        }
        return false;
    }
    wasCompleted(habit, date) {
        const targetDate = (0, date_utils_1.normalizeDate)(date).getTime();
        return habit.records.some((record) => (0, date_utils_1.normalizeDate)(record.date).getTime() === targetDate && record.completed);
    }
    async getWeeklyProgress(userId) {
        const today = (0, date_utils_1.getToday)();
        const currentDay = today.getUTCDay();
        const differenceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(today);
        monday.setUTCDate(today.getUTCDate() + differenceToMonday);
        const normalizedMonday = (0, date_utils_1.normalizeDate)(monday);
        const sunday = new Date(normalizedMonday);
        sunday.setUTCDate(normalizedMonday.getUTCDate() + 6);
        const habits = await this.prisma.habit.findMany({
            where: {
                userId,
            },
            include: {
                records: {
                    where: {
                        date: {
                            gte: normalizedMonday,
                            lte: sunday,
                        },
                    },
                    select: {
                        date: true,
                        completed: true,
                    },
                },
            },
        });
        const days = [];
        let totalScheduled = 0;
        let totalCompleted = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date(normalizedMonday);
            date.setUTCDate(normalizedMonday.getUTCDate() + i);
            let scheduled = 0;
            let completed = 0;
            for (const habit of habits) {
                if (this.isHabitScheduledForDate(habit, date)) {
                    scheduled++;
                    if (this.wasCompleted(habit, date)) {
                        completed++;
                    }
                }
            }
            const isFutureDate = date.getTime() > today.getTime();
            if (!isFutureDate) {
                totalScheduled += scheduled;
                totalCompleted += completed;
            }
            days.push({
                date,
                scheduled,
                completed,
                percentage: scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100),
            });
        }
        const percentage = totalScheduled === 0
            ? 0
            : Math.round((totalCompleted / totalScheduled) * 100);
        return {
            startDate: normalizedMonday,
            endDate: sunday,
            scheduled: totalScheduled,
            completed: totalCompleted,
            pending: totalScheduled - totalCompleted,
            percentage,
            days,
        };
    }
    async getMonthlyProgress(userId) {
        const today = (0, date_utils_1.getToday)();
        const year = today.getUTCFullYear();
        const month = today.getUTCMonth();
        const firstDay = new Date(Date.UTC(year, month, 1));
        const lastDay = new Date(Date.UTC(year, month + 1, 0));
        const habits = await this.prisma.habit.findMany({
            where: {
                userId,
            },
            include: {
                records: {
                    where: {
                        date: {
                            gte: firstDay,
                            lte: lastDay,
                        },
                    },
                    select: {
                        date: true,
                        completed: true,
                    },
                },
            },
        });
        let totalScheduled = 0;
        let totalCompleted = 0;
        const days = [];
        const totalDays = lastDay.getUTCDate();
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(Date.UTC(year, month, day));
            if (date.getTime() > today.getTime()) {
                break;
            }
            let scheduled = 0;
            let completed = 0;
            for (const habit of habits) {
                if (this.isHabitScheduledForDate(habit, date)) {
                    scheduled++;
                    if (this.wasCompleted(habit, date)) {
                        completed++;
                    }
                }
            }
            totalScheduled += scheduled;
            totalCompleted += completed;
            days.push({
                date,
                scheduled,
                completed,
                percentage: scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100),
            });
        }
        const percentage = totalScheduled === 0
            ? 0
            : Math.round((totalCompleted / totalScheduled) * 100);
        return {
            year,
            month: month + 1,
            scheduled: totalScheduled,
            completed: totalCompleted,
            pending: totalScheduled - totalCompleted,
            percentage,
            days,
        };
    }
    calculateStreak(habit) {
        const today = (0, date_utils_1.getToday)();
        const startDate = (0, date_utils_1.normalizeDate)(habit.startDate);
        const endDate = habit.endDate && habit.endDate < today
            ? (0, date_utils_1.normalizeDate)(habit.endDate)
            : today;
        const scheduledDates = [];
        const date = new Date(startDate);
        while (date <= endDate) {
            if (this.isHabitScheduledForDate(habit, date)) {
                scheduledDates.push(new Date(date));
            }
            date.setUTCDate(date.getUTCDate() + 1);
        }
        let currentStreak = 0;
        let bestStreak = 0;
        let runningStreak = 0;
        for (const scheduledDate of scheduledDates) {
            const isToday = scheduledDate.getTime() === today.getTime();
            if (this.wasCompleted(habit, scheduledDate)) {
                runningStreak++;
                if (runningStreak > bestStreak) {
                    bestStreak = runningStreak;
                }
            }
            else if (!isToday) {
                runningStreak = 0;
            }
        }
        currentStreak = runningStreak;
        return {
            currentStreak,
            bestStreak,
        };
    }
    async getStreaks(userId) {
        const habits = await this.prisma.habit.findMany({
            where: {
                userId,
                active: true,
            },
            include: {
                records: {
                    select: {
                        date: true,
                        completed: true,
                    },
                },
            },
        });
        const habitStreaks = habits.map((habit) => {
            const streak = this.calculateStreak(habit);
            return {
                habitId: habit.id,
                name: habit.name,
                frequency: habit.frequency,
                currentStreak: streak.currentStreak,
                bestStreak: streak.bestStreak,
            };
        });
        const longestCurrentStreak = habitStreaks.reduce((max, habit) => Math.max(max, habit.currentStreak), 0);
        const bestStreak = habitStreaks.reduce((max, habit) => Math.max(max, habit.bestStreak), 0);
        return {
            longestCurrentStreak,
            bestStreak,
            habits: habitStreaks,
        };
    }
    async getTrend(userId) {
        const today = (0, date_utils_1.getToday)();
        const startDate = new Date(today);
        startDate.setUTCDate(startDate.getUTCDate() - 29);
        const habits = await this.prisma.habit.findMany({
            where: {
                userId,
            },
            include: {
                records: {
                    where: {
                        date: {
                            gte: startDate,
                            lte: today,
                        },
                    },
                    select: {
                        date: true,
                        completed: true,
                    },
                },
            },
        });
        const trend = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(startDate);
            date.setUTCDate(startDate.getUTCDate() + i);
            let scheduled = 0;
            let completed = 0;
            for (const habit of habits) {
                if (this.isHabitScheduledForDate(habit, date)) {
                    scheduled++;
                    if (this.wasCompleted(habit, date)) {
                        completed++;
                    }
                }
            }
            const percentage = scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100);
            trend.push({
                date,
                scheduled,
                completed,
                percentage,
            });
        }
        return {
            startDate,
            endDate: today,
            days: trend,
        };
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map