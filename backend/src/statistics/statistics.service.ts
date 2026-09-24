import { Injectable } from '@nestjs/common';

import { HabitDay, HabitFrequency } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { getHabitDay, getToday, normalizeDate } from '../common/date.utils';

type HabitForStatistics = {
  id: string;
  name: string;

  frequency: HabitFrequency;

  weeklyDay: HabitDay | null;

  customDays: HabitDay[];

  startDate: Date;

  endDate: Date | null;

  records: {
    date: Date;
    completed: boolean;
  }[];
};

type ProgressDay = {
  date: Date;
  scheduled: number;
  completed: number;
  percentage: number;
};

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const today = getToday();

    const todayDay = getHabitDay(today);

    const totalHabits = await this.prisma.habit.count({
      where: {
        userId,
      },
    });

    const finishedHabits = await this.prisma.habit.count({
      where: {
        userId,

        endDate: {
          lt: today,
        },
      },
    });

    const activeHabits = await this.prisma.habit.count({
      where: {
        userId,
        active: true,

        startDate: {
          lte: today,
        },

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
    });

    const todayHabits = await this.prisma.habit.findMany({
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
    });

    const habitsToday = todayHabits.length;

    const completedToday = todayHabits.filter(
      (habit) => habit.records[0]?.completed === true,
    ).length;

    const pendingToday = habitsToday - completedToday;

    const completionPercentage =
      habitsToday === 0 ? 0 : Math.round((completedToday / habitsToday) * 100);

    return {
      totalHabits,
      activeHabits,
      habitsToday,
      finishedHabits,
      completedToday,
      pendingToday,
      completionPercentage,
    };
  }

  private isHabitScheduledForDate(habit: HabitForStatistics, date: Date) {
    const day = normalizeDate(date);

    const startDate = normalizeDate(habit.startDate);

    const endDate = habit.endDate ? normalizeDate(habit.endDate) : null;

    if (day < startDate) {
      return false;
    }

    if (endDate && day > endDate) {
      return false;
    }

    const habitDay = getHabitDay(day);

    if (habit.frequency === HabitFrequency.DAILY) {
      return true;
    }

    if (habit.frequency === HabitFrequency.WEEKLY) {
      return habit.weeklyDay === habitDay;
    }

    if (habit.frequency === HabitFrequency.CUSTOM) {
      return habit.customDays.includes(habitDay);
    }

    return false;
  }

  private wasCompleted(habit: HabitForStatistics, date: Date) {
    const targetDate = normalizeDate(date).getTime();

    return habit.records.some(
      (record) =>
        normalizeDate(record.date).getTime() === targetDate && record.completed,
    );
  }

  async getWeeklyProgress(userId: string) {
    const today = getToday();

    // getToday() devuelve una fecha normalizada en UTC,
    // así que todo el cálculo debe seguir usando UTC.
    const currentDay = today.getUTCDay();

    const differenceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);

    monday.setUTCDate(today.getUTCDate() + differenceToMonday);

    const normalizedMonday = normalizeDate(monday);

    const sunday = new Date(normalizedMonday);

    sunday.setUTCDate(normalizedMonday.getUTCDate() + 6);

    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
      },

      include: {
        records: {
          where: {
            date: {
              gte: normalizedMonday,
              lte: sunday,
            },
          },

          select: {
            date: true,
            completed: true,
          },
        },
      },
    });

    const days: ProgressDay[] = [];

    let totalScheduled = 0;
    let totalCompleted = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(normalizedMonday);

      date.setUTCDate(normalizedMonday.getUTCDate() + i);

      let scheduled = 0;
      let completed = 0;

      for (const habit of habits) {
        if (this.isHabitScheduledForDate(habit, date)) {
          scheduled++;

          if (this.wasCompleted(habit, date)) {
            completed++;
          }
        }
      }

      /*
       * Solo contamos en el resumen
       * los días que ya ocurrieron,
       * incluyendo hoy.
       *
       * Los días futuros siguen apareciendo
       * en la gráfica como programación,
       * pero no disminuyen el porcentaje.
       */
      const isFutureDate = date.getTime() > today.getTime();

      if (!isFutureDate) {
        totalScheduled += scheduled;
        totalCompleted += completed;
      }

      days.push({
        date,
        scheduled,
        completed,

        percentage:
          scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100),
      });
    }

    const percentage =
      totalScheduled === 0
        ? 0
        : Math.round((totalCompleted / totalScheduled) * 100);

    return {
      startDate: normalizedMonday,
      endDate: sunday,

      scheduled: totalScheduled,
      completed: totalCompleted,

      pending: totalScheduled - totalCompleted,

      percentage,

      days,
    };
  }

  async getMonthlyProgress(userId: string) {
    const today = getToday();

    const year = today.getUTCFullYear();

    const month = today.getUTCMonth();

    const firstDay = new Date(Date.UTC(year, month, 1));

    const lastDay = new Date(Date.UTC(year, month + 1, 0));

    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
      },

      include: {
        records: {
          where: {
            date: {
              gte: firstDay,
              lte: lastDay,
            },
          },

          select: {
            date: true,
            completed: true,
          },
        },
      },
    });

    let totalScheduled = 0;
    let totalCompleted = 0;

    const days: ProgressDay[] = [];

    const totalDays = lastDay.getUTCDate();

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(Date.UTC(year, month, day));

      /*
       * El resumen mensual representa
       * el progreso hasta hoy.
       */
      if (date.getTime() > today.getTime()) {
        break;
      }

      let scheduled = 0;
      let completed = 0;

      for (const habit of habits) {
        if (this.isHabitScheduledForDate(habit, date)) {
          scheduled++;

          if (this.wasCompleted(habit, date)) {
            completed++;
          }
        }
      }

      totalScheduled += scheduled;
      totalCompleted += completed;

      days.push({
        date,
        scheduled,
        completed,

        percentage:
          scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100),
      });
    }

    const percentage =
      totalScheduled === 0
        ? 0
        : Math.round((totalCompleted / totalScheduled) * 100);

    return {
      year,
      month: month + 1,

      scheduled: totalScheduled,
      completed: totalCompleted,

      pending: totalScheduled - totalCompleted,

      percentage,

      days,
    };
  }

  private calculateStreak(habit: HabitForStatistics) {
    const today = getToday();

    const startDate = normalizeDate(habit.startDate);

    const endDate =
      habit.endDate && habit.endDate < today
        ? normalizeDate(habit.endDate)
        : today;

    const scheduledDates: Date[] = [];

    const date = new Date(startDate);

    while (date <= endDate) {
      if (this.isHabitScheduledForDate(habit, date)) {
        scheduledDates.push(new Date(date));
      }

      date.setUTCDate(date.getUTCDate() + 1);
    }

    let currentStreak = 0;
    let bestStreak = 0;
    let runningStreak = 0;

    for (const scheduledDate of scheduledDates) {
      const isToday = scheduledDate.getTime() === today.getTime();
      if (this.wasCompleted(habit, scheduledDate)) {
        runningStreak++;

        if (runningStreak > bestStreak) {
          bestStreak = runningStreak;
        }
      } else if (!isToday) {
        runningStreak = 0;
      }
    }

    currentStreak = runningStreak;
    return {
      currentStreak,
      bestStreak,
    };
  }
  async getStreaks(userId: string) {
    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        active: true,
      },

      include: {
        records: {
          select: {
            date: true,
            completed: true,
          },
        },
      },
    });

    const habitStreaks = habits.map((habit) => {
      const streak = this.calculateStreak(habit);

      return {
        habitId: habit.id,

        name: habit.name,

        frequency: habit.frequency,

        currentStreak: streak.currentStreak,

        bestStreak: streak.bestStreak,
      };
    });

    const longestCurrentStreak = habitStreaks.reduce(
      (max, habit) => Math.max(max, habit.currentStreak),
      0,
    );

    const bestStreak = habitStreaks.reduce(
      (max, habit) => Math.max(max, habit.bestStreak),
      0,
    );

    return {
      longestCurrentStreak,
      bestStreak,
      habits: habitStreaks,
    };
  }
  async getTrend(userId: string) {
    const today = getToday();

    const startDate = new Date(today);

    startDate.setUTCDate(startDate.getUTCDate() - 29);

    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
      },

      include: {
        records: {
          where: {
            date: {
              gte: startDate,
              lte: today,
            },
          },

          select: {
            date: true,
            completed: true,
          },
        },
      },
    });

    const trend: ProgressDay[] = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);

      date.setUTCDate(startDate.getUTCDate() + i);

      let scheduled = 0;
      let completed = 0;

      for (const habit of habits) {
        if (this.isHabitScheduledForDate(habit, date)) {
          scheduled++;

          if (this.wasCompleted(habit, date)) {
            completed++;
          }
        }
      }

      const percentage =
        scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100);

      trend.push({
        date,
        scheduled,
        completed,
        percentage,
      });
    }

    return {
      startDate,
      endDate: today,
      days: trend,
    };
  }
}
