export declare class SummaryResponseDto {
    totalHabits: number;
    activeHabits: number;
    finishedHabits: number;
    habitsToday: number;
    completedToday: number;
    pendingToday: number;
    completionPercentage: number;
}
export declare class ProgressDayDto {
    date: Date;
    scheduled: number;
    completed: number;
    percentage: number;
}
export declare class WeeklyProgressResponseDto {
    startDate: Date;
    endDate: Date;
    scheduled: number;
    completed: number;
    pending: number;
    percentage: number;
    days: ProgressDayDto[];
}
export declare class MonthlyProgressResponseDto {
    year: number;
    month: number;
    scheduled: number;
    completed: number;
    pending: number;
    percentage: number;
    days: ProgressDayDto[];
}
export declare class HabitStreakDto {
    habitId: string;
    name: string;
    frequency: string;
    currentStreak: number;
    bestStreak: number;
}
export declare class StreaksResponseDto {
    longestCurrentStreak: number;
    bestStreak: number;
    habits: HabitStreakDto[];
}
export declare class TrendResponseDto {
    startDate: Date;
    endDate: Date;
    days: ProgressDayDto[];
}
