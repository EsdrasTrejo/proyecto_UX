import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HabitDay, HabitFrequency } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MarkHabitDto } from './dto/mark-habit.dto';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { getHabitDay, getToday } from '../common/date.utils';

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, createHabitDto: CreateHabitDto) {
    const startDate = new Date(createHabitDto.startDate);

    const endDate = createHabitDto.endDate
      ? new Date(createHabitDto.endDate)
      : undefined;

    if (endDate && endDate < startDate) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la fecha de inicio',
      );
    }

    const schedule = this.normalizeFrequency(
      createHabitDto.frequency,
      createHabitDto.weeklyDay,
      createHabitDto.customDays,
    );

    return this.prisma.habit.create({
      data: {
        name: createHabitDto.name,
        description: createHabitDto.description,
        category: createHabitDto.category,

        frequency: createHabitDto.frequency,

        weeklyDay: schedule.weeklyDay,
        customDays: schedule.customDays,

        priority: createHabitDto.priority,

        startDate,
        endDate,

        userId,
      },
    });
  }

  private normalizeFrequency(
    frequency: HabitFrequency,
    weeklyDay?: HabitDay,
    customDays?: HabitDay[],
  ) {
    if (frequency === HabitFrequency.DAILY) {
      return {
        weeklyDay: null,
        customDays: [],
      };
    }

    if (frequency === HabitFrequency.WEEKLY) {
      if (!weeklyDay) {
        throw new BadRequestException(
          'Debes seleccionar un día para la frecuencia semanal',
        );
      }

      return {
        weeklyDay,
        customDays: [],
      };
    }

    if (
      frequency === HabitFrequency.CUSTOM &&
      (!customDays || customDays.length === 0)
    ) {
      throw new BadRequestException(
        'Debes seleccionar al menos un día para una frecuencia personalizada',
      );
    }

    return {
      weeklyDay: null,
      customDays: customDays ?? [],
    };
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
    const habit = await this.findOne(id, userId);

    const today = getToday();

    const todayDay = getHabitDay(today);

    // Comprobar si el hábito está activo
    if (!habit.active) {
      throw new BadRequestException('No puedes completar un hábito inactivo');
    }

    // Comprobar fecha de inicio
    if (habit.startDate > today) {
      throw new BadRequestException('Este hábito todavía no ha iniciado');
    }

    // Comprobar fecha de finalización
    if (habit.endDate && habit.endDate < today) {
      throw new BadRequestException('Este hábito ya finalizó');
    }

    // Verificar si corresponde al día actual
    let correspondsToday = false;

    if (habit.frequency === HabitFrequency.DAILY) {
      correspondsToday = true;
    }

    if (
      habit.frequency === HabitFrequency.WEEKLY &&
      habit.weeklyDay === todayDay
    ) {
      correspondsToday = true;
    }

    if (
      habit.frequency === HabitFrequency.CUSTOM &&
      habit.customDays.includes(todayDay)
    ) {
      correspondsToday = true;
    }

    if (!correspondsToday) {
      throw new BadRequestException('Este hábito no corresponde al día de hoy');
    }

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
    const habit = await this.findOne(id, userId);

    const startDate = updateHabitDto.startDate
      ? new Date(updateHabitDto.startDate)
      : habit.startDate;

    const endDate = updateHabitDto.endDate
      ? new Date(updateHabitDto.endDate)
      : habit.endDate;

    if (endDate && endDate < startDate) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la fecha de inicio',
      );
    }

    const frequency = updateHabitDto.frequency ?? habit.frequency;

    const weeklyDay = updateHabitDto.weeklyDay ?? habit.weeklyDay ?? undefined;

    const customDays = updateHabitDto.customDays ?? habit.customDays;

    const schedule = this.normalizeFrequency(frequency, weeklyDay, customDays);

    return this.prisma.habit.update({
      where: {
        id,
      },

      data: {
        name: updateHabitDto.name,
        description: updateHabitDto.description,
        category: updateHabitDto.category,

        frequency,

        weeklyDay: schedule.weeklyDay,
        customDays: schedule.customDays,

        priority: updateHabitDto.priority,

        startDate: updateHabitDto.startDate ? startDate : undefined,

        endDate: updateHabitDto.endDate ? endDate : undefined,

        active: updateHabitDto.active,
      },
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
    // Verifica que el hábito existe
    // y pertenece al usuario autenticado
    await this.findOne(id, userId);

    // Elimina primero todos sus registros
    await this.prisma.habitRecord.deleteMany({
      where: {
        habitId: id,
        userId,
      },
    });

    // Después elimina el hábito
    await this.prisma.habit.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Hábito eliminado correctamente',
    };
  }

  async findToday(userId: string) {
    const today = getToday();

    const todayDay = getHabitDay(today);

    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        active: true,

        startDate: {
          lte: today,
        },

        AND: [
          {
            OR: [
              {
                endDate: null,
              },
              {
                endDate: {
                  gte: today,
                },
              },
            ],
          },

          {
            OR: [
              {
                frequency: HabitFrequency.DAILY,
              },

              {
                frequency: HabitFrequency.WEEKLY,

                weeklyDay: todayDay,
              },

              {
                frequency: HabitFrequency.CUSTOM,

                customDays: {
                  has: todayDay,
                },
              },
            ],
          },
        ],
      },

      include: {
        records: {
          where: {
            date: today,
          },

          select: {
            completed: true,
          },
        },
      },

      orderBy: {
        priority: 'desc',
      },
    });

    return habits.map(({ records, ...habit }) => ({
      ...habit,

      completedToday: records[0]?.completed ?? false,
    }));
  }
}
