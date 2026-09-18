import { HabitDay } from '@prisma/client';
export declare function getHabitDay(date: Date): HabitDay;
export declare function getToday(): Date;
export declare function normalizeDate(date: Date): Date;
