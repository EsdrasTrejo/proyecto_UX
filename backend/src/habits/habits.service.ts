import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MarkHabitDto } from './dto/mark-habit.dto';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, createHabitDto: CreateHabitDto) {
    return this.prisma.habit.create({
      data: {
        name: createHabitDto.name,
        description: createHabitDto.description,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }

    return habit;
  }

  async markToday(id: string, userId: string, markHabitDto: MarkHabitDto) {
    // Comprobamos primero que el hábito
    // realmente pertenece al usuario
    await this.findOne(id, userId);

    const now = new Date();

    // Guardamos únicamente el día.
    // Esto evita crear varios registros
    // diferentes para el mismo hábito el mismo día.
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    return this.prisma.habitRecord.upsert({
      where: {
        habitId_userId_date: {
          habitId: id,
          userId,
          date: today,
        },
      },

      update: {
        completed: markHabitDto.completed,
      },

      create: {
        habitId: id,
        userId,
        date: today,
        completed: markHabitDto.completed,
      },
    });
  }

  async update(id: string, userId: string, updateHabitDto: UpdateHabitDto) {
    await this.findOne(id, userId);

    return this.prisma.habit.update({
      where: {
        id,
      },

      data: updateHabitDto,
    });
  }

  async findRecords(id: string, userId: string) {
    // Otra vez verificamos propiedad
    await this.findOne(id, userId);

    return this.prisma.habitRecord.findMany({
      where: {
        habitId: id,
        userId,
      },

      orderBy: {
        date: 'desc',
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.habit.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Hábito eliminado correctamente',
    };
  }
}
