import { HabitDay, HabitFrequency, HabitPriority } from '@prisma/client';
export declare class UpdateHabitDto {
    name?: string;
    description?: string;
    category?: string;
    frequency?: HabitFrequency;
    weeklyDay?: HabitDay;
    customDays?: HabitDay[];
    priority?: HabitPriority;
    startDate?: string;
    endDate?: string;
    active?: boolean;
}
