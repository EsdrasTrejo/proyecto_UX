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

  private getHabitDay(day: number): HabitDay {
    const days: HabitDay[] = [
      HabitDay.SUNDAY,
      HabitDay.MONDAY,
      HabitDay.TUESDAY,
      HabitDay.WEDNESDAY,
      HabitDay.THURSDAY,
      HabitDay.FRIDAY,
      HabitDay.SATURDAY,
    ];

    return days[day];
  }

  async findToday(userId: string) {
    const now = new Date();

    const todayDay = this.getHabitDay(now.getDay());

    const today = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );

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
