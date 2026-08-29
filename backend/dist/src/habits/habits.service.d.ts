import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
export declare class HabitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createHabitDto: CreateHabitDto): import("@prisma/client").Prisma.Prisma__HabitClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        completed: boolean;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(userId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        completed: boolean;
        userId: string;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        completed: boolean;
        userId: string;
    }>;
    update(id: string, userId: string, updateHabitDto: UpdateHabitDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        completed: boolean;
        userId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
