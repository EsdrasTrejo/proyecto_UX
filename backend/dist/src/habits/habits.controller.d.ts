import { Request } from 'express';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { MarkHabitDto } from './dto/mark-habit.dto';
interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
        email: string;
    };
}
export declare class HabitsController {
    private readonly habitsService;
    constructor(habitsService: HabitsService);
    create(request: AuthenticatedRequest, createHabitDto: CreateHabitDto): import("@prisma/client").Prisma.Prisma__HabitClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string | null;
        frequency: import("@prisma/client").$Enums.HabitFrequency;
        weeklyDay: import("@prisma/client").$Enums.HabitDay | null;
        customDays: import("@prisma/client").$Enums.HabitDay[];
        priority: import("@prisma/client").$Enums.HabitPriority;
        startDate: Date;
        endDate: Date | null;
        active: boolean;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(request: AuthenticatedRequest): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string | null;
        frequency: import("@prisma/client").$Enums.HabitFrequency;
        weeklyDay: import("@prisma/client").$Enums.HabitDay | null;
        customDays: import("@prisma/client").$Enums.HabitDay[];
        priority: import("@prisma/client").$Enums.HabitPriority;
        startDate: Date;
        endDate: Date | null;
        active: boolean;
        userId: string;
    }[]>;
    findOne(id: string, request: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string | null;
        frequency: import("@prisma/client").$Enums.HabitFrequency;
        weeklyDay: import("@prisma/client").$Enums.HabitDay | null;
        customDays: import("@prisma/client").$Enums.HabitDay[];
        priority: import("@prisma/client").$Enums.HabitPriority;
        startDate: Date;
        endDate: Date | null;
        active: boolean;
        userId: string;
    }>;
    update(id: string, request: AuthenticatedRequest, updateHabitDto: UpdateHabitDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string | null;
        frequency: import("@prisma/client").$Enums.HabitFrequency;
        weeklyDay: import("@prisma/client").$Enums.HabitDay | null;
        customDays: import("@prisma/client").$Enums.HabitDay[];
        priority: import("@prisma/client").$Enums.HabitPriority;
        startDate: Date;
        endDate: Date | null;
        active: boolean;
        userId: string;
    }>;
    remove(id: string, request: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    markToday(id: string, request: AuthenticatedRequest, markHabitDto: MarkHabitDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        completed: boolean;
        userId: string;
        date: Date;
        habitId: string;
    }>;
    findRecords(id: string, request: AuthenticatedRequest): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        completed: boolean;
        userId: string;
        date: Date;
        habitId: string;
    }[]>;
    findToday(request: AuthenticatedRequest): Promise<{
        completedToday: boolean;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        category: string | null;
        frequency: import("@prisma/client").$Enums.HabitFrequency;
        weeklyDay: import("@prisma/client").$Enums.HabitDay | null;
        customDays: import("@prisma/client").$Enums.HabitDay[];
        priority: import("@prisma/client").$Enums.HabitPriority;
        startDate: Date;
        endDate: Date | null;
        active: boolean;
        userId: string;
    }[]>;
}
export {};
