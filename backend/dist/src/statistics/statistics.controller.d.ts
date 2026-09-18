import { Request } from 'express';
import { StatisticsService } from './statistics.service';
interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
        email: string;
    };
}
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getSummary(request: AuthenticatedRequest): Promise<{
        totalHabits: number;
        activeHabits: number;
        habitsToday: number;
        finishedHabits: number;
        completedToday: number;
        pendingToday: number;
        completionPercentage: number;
    }>;
    getWeeklyProgress(request: AuthenticatedRequest): Promise<{
        startDate: Date;
        endDate: Date;
        scheduled: number;
        completed: number;
        pending: number;
        percentage: number;
        days: {
            date: Date;
            scheduled: number;
            completed: number;
            percentage: number;
        }[];
    }>;
    getMonthlyProgress(request: AuthenticatedRequest): Promise<{
        year: number;
        month: number;
        scheduled: number;
        completed: number;
        pending: number;
        percentage: number;
        days: {
            date: Date;
            scheduled: number;
            completed: number;
            percentage: number;
        }[];
    }>;
    getStreaks(request: AuthenticatedRequest): Promise<{
        longestCurrentStreak: number;
        bestStreak: number;
        habits: {
            habitId: string;
            name: string;
            frequency: import("@prisma/client").$Enums.HabitFrequency;
            currentStreak: number;
            bestStreak: number;
        }[];
    }>;
    getTrend(request: AuthenticatedRequest): Promise<{
        startDate: Date;
        endDate: Date;
        days: {
            date: Date;
            scheduled: number;
            completed: number;
            percentage: number;
        }[];
    }>;
}
export {};
