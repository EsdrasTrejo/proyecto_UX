import { Request } from 'express';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
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
        completed: boolean;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(request: AuthenticatedRequest): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        completed: boolean;
        userId: string;
    }[]>;
    findOne(id: string, request: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        completed: boolean;
        userId: string;
    }>;
    update(id: string, request: AuthenticatedRequest, updateHabitDto: UpdateHabitDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        completed: boolean;
        userId: string;
    }>;
    remove(id: string, request: AuthenticatedRequest): Promise<{
        message: string;
    }>;
}
export {};
