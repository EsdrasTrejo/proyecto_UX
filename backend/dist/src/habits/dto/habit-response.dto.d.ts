import { HabitDay, HabitFrequency, HabitPriority } from '@prisma/client';
export declare class HabitResponseDto {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    frequency: HabitFrequency;
    weeklyDay: HabitDay | null;
    customDays: HabitDay[];
    priority: HabitPriority;
    startDate: Date;
    endDate: Date | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}
