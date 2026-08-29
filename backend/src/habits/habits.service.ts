import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

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

  async update(id: string, userId: string, updateHabitDto: UpdateHabitDto) {
    await this.findOne(id, userId);

    return this.prisma.habit.update({
      where: {
        id,
      },

      data: updateHabitDto,
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
