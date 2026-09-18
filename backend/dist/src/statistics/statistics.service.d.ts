import { PrismaService } from '../prisma/prisma.service';
type ProgressDay = {
    date: Date;
    scheduled: number;
    completed: number;
    percentage: number;
};
export declare class StatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummary(userId: string): Promise<{
        totalHabits: number;
        activeHabits: number;
        habitsToday: number;
        finishedHabits: number;
        completedToday: number;
        pendingToday: number;
        completionPercentage: number;
    }>;
    private isHabitScheduledForDate;
    private wasCompleted;
    getWeeklyProgress(userId: string): Promise<{
        startDate: Date;
        endDate: Date;
        scheduled: number;
        completed: number;
        pending: number;
        percentage: number;
        days: ProgressDay[];
    }>;
    getMonthlyProgress(userId: string): Promise<{
        year: number;
        month: number;
        scheduled: number;
        completed: number;
        pending: number;
        percentage: number;
        days: ProgressDay[];
    }>;
    private calculateStreak;
    getStreaks(userId: string): Promise<{
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
    getTrend(userId: string): Promise<{
        startDate: Date;
        endDate: Date;
        days: ProgressDay[];
    }>;
}
export {};
